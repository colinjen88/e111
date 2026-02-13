/**
 * useBooking — Shared booking flow state & logic
 * 
 * Centralizes all booking data, API calls, and step navigation
 * so that sub-components only need to call actions and read state.
 */
export const useBooking = () => {
    // ===================== Step Navigation =====================
    const step = useState('booking-step', () => 1)
    const direction = useState<'forward' | 'back'>('booking-direction', () => 'forward')

    const stepLabels = ['分館', '服務', '技師', '時間', '確認']
    const stepIcons = ['🏠', '💆', '👤', '🕐', '✅']

    const goToStep = (target: number) => {
        direction.value = target > step.value ? 'forward' : 'back'
        step.value = target
    }

    const goBack = () => {
        if (step.value > 1 && step.value < 6) {
            goToStep(step.value - 1)
        }
    }

    // ===================== Booking Data =====================
    const bookingData = useState('booking-data', () => reactive({
        branch: null as any,
        service: null as any,
        staff: null as any,
        date: new Date().toISOString().split('T')[0],
        time: null as string | null,
        customer: {
            name: '',
            phone: '',
            email: '',
            note: ''
        }
    }))

    // ===================== API Fetches =====================
    // Step 1: Branches
    const { data: branches, pending: loadingBranches, error: errorBranches } = useLazyFetch('/api/branches')

    // Step 2: Services (categories with nested services)
    const { data: categories, pending: loadingServices, error: errorServices } = useLazyFetch('/api/services')
    const activeCategory = useState('booking-active-category', () => null as any)

    watch(categories, (cats) => {
        if (cats && (cats as any[]).length > 0) activeCategory.value = (cats as any[])[0]
    })

    // Step 3: Staff (fetched after branch is selected)
    const { data: staffList, pending: loadingStaff, refresh: refreshStaff, error: errorStaff } = useLazyFetch('/api/staff', {
        immediate: false,
        query: computed(() => ({ branchId: bookingData.value.branch?.id }))
    })

    // Step 4: Availability slots
    const { data: availability, pending: loadingSlots, refresh: refreshSlots, error: errorSlots } = useLazyFetch('/api/availability', {
        immediate: false,
        query: computed(() => ({
            date: bookingData.value.date,
            branchId: bookingData.value.branch?.id,
            staffId: bookingData.value.staff?.id,
            duration: bookingData.value.service?.durationMinutes
        }))
    })

    // ===================== Selection Handlers =====================
    const selectBranch = (branch: any) => {
        bookingData.value.branch = branch
        goToStep(2)
    }

    const selectCategory = (category: any) => {
        activeCategory.value = category
    }

    const selectService = (service: any) => {
        bookingData.value.service = service
        goToStep(3)
        refreshStaff()
    }

    const selectStaff = (staff: any) => {
        bookingData.value.staff = staff
        goToStep(4)
        refreshSlots()
    }

    const selectNoPreference = () => {
        bookingData.value.staff = null
        goToStep(4)
        refreshSlots()
    }

    const selectDate = (dateStr: string) => {
        bookingData.value.date = dateStr
        bookingData.value.time = null
        refreshSlots()
    }

    const selectTime = (time: string, isAvailable: boolean) => {
        if (!isAvailable) return
        bookingData.value.time = time
        goToStep(5)
    }

    // ===================== Submission =====================
    const submitting = ref(false)
    const submitError = ref('')
    const bookingResult = ref(null as any)

    const submitBooking = async () => {
        if (!bookingData.value.customer.name || !bookingData.value.customer.phone) {
            submitError.value = '請填寫姓名與電話'
            return
        }

        submitting.value = true
        submitError.value = ''

        try {
            const data = await $fetch('/api/bookings', {
                method: 'POST',
                body: {
                    branchId: bookingData.value.branch?.id,
                    serviceId: bookingData.value.service?.id,
                    staffId: bookingData.value.staff?.id,
                    date: bookingData.value.date,
                    time: bookingData.value.time,
                    user: {
                        name: bookingData.value.customer.name,
                        phone: bookingData.value.customer.phone,
                        email: bookingData.value.customer.email,
                        note: bookingData.value.customer.note
                    }
                }
            })

            bookingResult.value = data
            goToStep(6)
        } catch (err: any) {
            submitError.value = err?.data?.statusMessage || '預約失敗，請稍後再試'
        } finally {
            submitting.value = false
        }
    }

    // ===================== Helper: Next 7 days =====================
    const next7Days = computed(() => {
        const days = []
        const today = new Date()
        for (let i = 0; i < 7; i++) {
            const d = new Date(today)
            d.setDate(today.getDate() + i)
            days.push({
                dateStr: d.toISOString().split('T')[0],
                dayName: i === 0 ? '今日' : i === 1 ? '明日' : d.toLocaleDateString('zh-TW', { weekday: 'short' }),
                dayNum: d.getDate()
            })
        }
        return days
    })

    return {
        // Navigation
        step,
        direction,
        stepLabels,
        stepIcons,
        goToStep,
        goBack,

        // Data
        bookingData,

        // Branches (Step 1)
        branches,
        loadingBranches,
        errorBranches,
        selectBranch,

        // Services (Step 2)
        categories,
        loadingServices,
        errorServices,
        activeCategory,
        selectCategory,
        selectService,

        // Staff (Step 3)
        staffList,
        loadingStaff,
        errorStaff,
        selectStaff,
        selectNoPreference,

        // DateTime (Step 4)
        availability,
        loadingSlots,
        errorSlots,
        next7Days,
        selectDate,
        selectTime,

        // Submission (Step 5)
        submitting,
        submitError,
        bookingResult,
        submitBooking,
    }
}
