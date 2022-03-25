export class Project {
    id: number
    name: string | null
    created_at: Date | null
    updated_at: Date | null
    client_id: number | null
    start_date: Date | null
    end_date: Date | null
    progress: number | null
    revenue: number | null
    logo: string | null
    status: number | null
    type: string | null
    sprint_ids: number[] | null
    user_ids: number[] | null

}