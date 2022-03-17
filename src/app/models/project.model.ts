export class Project {
    id: number
    name: string
    created_at: Date
    updated_at: Date
    client_id: number
    start_date: Date
    end_date: Date
    progress: number
    revenue: number
    logo: string
    status: number
    type: string
    sprint_ids: number[]
    user_ids: number[]

    constructor(
        name: string,
        status: number,
        start_date: Date,
        end_date: Date,
        progress: number,
        revenue: number,
        client_id: number,
        user_ids: number[],){

        this.name = name
        this.status = status
        this.start_date = start_date
        this.end_date = end_date
        this.progress = progress
        this.revenue = revenue
        this.client_id = client_id
        this.user_ids = user_ids
    }
}