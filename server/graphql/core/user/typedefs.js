const Schema = `
  type UserInfo {
    uid: Int
    avatar: String
    nickname: String
    user_role_ids: String
    home_page: String
    company: String
    profession: String
    shell_balance: Int
    articleCount: Int
    dynamicCount: Int
  }

  type UserUnreadCount {
    messageCount: Int
    attentionCount: Int
  }

  type senderUserInfo {
    uid: Int
    avatar: String
    nickname: String
  }

  type associateArticleInfo {
    aid: Int
    id: Int
    books_id: Int
    title: String
    content: String
  }

  type AttentionMsgInfo {
    receive_uid: String
    create_dt: String
    sender: senderUserInfo
    associateInfo: associateArticleInfo
    actionText: String
    typeText: String
    type: Int
  }

  type AttentionMsg {
    count: Int
    list: [AttentionMsgInfo]
    page: Int
    pageSize: Int
  }
`

const Query = `
  userInfo(uid: Int!): UserInfo
  userUnreadCount: UserUnreadCount
  userUnreadList(page: Int!,pageSize: Int!): AttentionMsg
`

const Mutation = ` 
  
`

module.exports = {
  Schema,
  Query,
  Mutation
}
