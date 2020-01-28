<h2 align="center"><img height="80" src="https://push.scoring.mn/minter-logo.png" /><br>Minter Push</h2>

В данном репозитории хранится код API (директория `back-end`) и веб-версии (`react-app`).

**Для добавления своего сценария на странице получения средств, можете делать Pull Request с готовым React-компонентом.**

#### POST-запрос (x-www-from-urlencoded) для генерации адресов:

```
https://push.minter-scoring.space/api/new

//Все параметры опциональны:

pass - Пароль
name - Имя получателя
fromName - Имя отправителя
payload - Сообщение
```
