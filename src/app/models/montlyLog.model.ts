import { Activity } from "./activity.model"

export class MontlyLogs {
    id: number
    created_at: Date
    updated_at: Date
    date: Date
    monthly_log_id: number
    smartworking: number
    activity_days_array: Activity[]
}