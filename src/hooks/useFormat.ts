/***
 * 自己书写格式化数据的函数
 * 数值/人民币金额
 */

function formatNumber(value: any) {
  // 正向预查 反向预查 ?!  ?<=
  // return `${value}`.replace(/(\d{3})(?=\d)/g, '$1,')
  return `${value}`.replace(/(\d)(?=(\d{3})+$)/g, '$1,')
}

// 可以用上面的函数去格式化数字和人民币金额
// 导出具有格式化功能的两个函数
export default function useFormat() {
  // 用来格式化数字的
  const numberFormat = (value: any) => formatNumber(value)
  // 用来格式化金额
  const moneyFormat = (value: any) => `￥${formatNumber(value)}`
  return {
    numberFormat,
    moneyFormat
  }

}