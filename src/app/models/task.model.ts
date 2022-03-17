import { Message } from "./message.model"

export class Task {
    id: number
    created_at: Date
    updated_at: Date
    name: string
    assigner_id: number
    assignee_id: number
    status: number
    closing_date: Date
    sprint_id: number
    effort: null
    priority: null
    start_date: Date
    end_date: Date
    message_list: Message[]
}