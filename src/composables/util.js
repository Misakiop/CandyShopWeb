//右侧消息提示
export function msgls(message, type = "success", dangerouslyUseHTMLString = false) {
  ElNotification({
    message,
    type,
    dangerouslyUseHTMLString,
    duration: 1500,
  });
}

// 中间消息提示
export function msgla(message, type = "success", dangerouslyUseHTMLString = false) {
  ElMessage({
    message,
    type,
    dangerouslyUseHTMLString,
    duration: 1500,
  });
}