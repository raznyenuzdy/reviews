Проблемы / Problems

1. Существенная проблема была связана с
   Error: Text content does not match server-rendered HTML
   было установлено, что эта ошибка реагирует на поле createdAt
   в базе, оно транслируется в next как из "будущего".
   Была попытка переименовать поле, это не снимало проблему
   Удаление поля при фетче данных, проблему снимало.
   Было так же установлено не соответствие временных зон
   клиента и сервера. Сервер имел зону +2 (Киев),
   сам клиент, на котором сервер и стоял, имел зону +1 (CET)
   когда серверу сменил зону на CET, ошибка исчезла

2. Чтобы роль, определенная как metadata была передана из auth0 в скссию, то в дашбоард auth0
   надо создать Action скрипт
   https://manage.auth0.com/dashboard/us/dev-cp2jcp8t/actions/library
   custom, build custom
   exports.onExecutePostLogin = async (event, api) => {
   if (event.authorization) {
   api.idToken.setCustomClaim(`user_metadata`, event.user.user_metadata);
   }
   }
и тогда определенная в настройках пользователя метадата, сейчас роль передастся в сессию
session.user.role
