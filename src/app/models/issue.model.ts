import { User } from "./user.model"

export class Issue {
    id: number
    created_at: Date
    updated_at: Date
    name: string
    description: string
    project_id: number
    user_id: number
    status: number
    comments: any[]
    files: any[]
    user: any
}