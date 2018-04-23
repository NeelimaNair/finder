export interface room{
    key?:string,
    name:string,
    receiver: string,
    chatId: string,
    lastUpdatedTime?: string,
    isRead?: boolean
}