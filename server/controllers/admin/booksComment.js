const models = require('../../../db/mysqldb/index')
const { resAdminJson } = require('../../utils/resData')
const moment = require('moment')
const Op = require('sequelize').Op

class BooksComment {
  /**
   * 获取标分页评论列表操作
   * @param   {object} ctx 上下文对象
   */
  static async getCommentList (req, res, next) {
    const { page = 1, pageSize = 10, content, status } = req.body
    try {
      let whereParams = {} // 定义查询条件

      content && (whereParams['content'] = { [Op.like]: `%${content}%` })
      status && (whereParams['status'] = status)

      let { count, rows } = await models.books_comment.findAndCountAll({
        where: whereParams, // 为空，获取全部，也可以自己添加条件
        offset: (page - 1) * Number(pageSize), // 开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: Number(pageSize) // 每页限制返回的数据条数
      })

      for (let i in rows) {
        rows[i].setDataValue(
          'create_dt',
          await moment(rows[i].create_date).format('YYYY-MM-DD H:m:s')
        )
        rows[i].setDataValue(
          'books',
          (await models.books.findOne({
            where: { books_id: rows[i].books_id },
            attributes: ['books_id', 'title']
          })) || []
        )
      }

      resAdminJson(res, {
        state: 'success',
        message: '返回成功',
        data: {
          count: count,
          list: rows
        }
      })
    } catch (err) {
      resAdminJson(res, {
        state: 'error',
        message: '错误信息：' + err.message
      })
    }
  }

  /**
   * 更新评论
   * @param   {object} ctx 上下文对象
   */
  static async updateComment (req, res, next) {
    const reqData = req.body
    try {
      await await models.books_comment.update(
        {
          status: reqData.status
        },
        {
          where: {
            id: reqData.id // 查询条件
          }
        }
      )
      resAdminJson(res, {
        state: 'success',
        message: '更新评论成功'
      })
    } catch (err) {
      resAdminJson(res, {
        state: 'error',
        message: '错误信息：' + err.message
      })
    }
  }

  /**
   * 删除评论
   */
  static async deleteComment (req, res, next) {
    const { id } = req.body
    try {
      let oneComment = await models.books_comment.findOne({ where: { id } })
      await models.books_comment.destroy({ where: { id } })
      await models.books.update(
        {
          // 更新文章评论数
          comment_count: await models.books_comment.count({
            where: {
              books_id: oneComment.books_id,
              parent_id: 0
            }
          })
        },
        { where: { books_id: oneComment.books_id } }
      )

      resAdminJson(res, {
        state: 'success',
        message: '删除用户评论成功'
      })
    } catch (err) {
      resAdminJson(res, {
        state: 'error',
        message: '错误信息：' + err.message
      })
    }
  }
}

module.exports = BooksComment
