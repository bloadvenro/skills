## Authority in external systems

- Access remote code repositories and hosting, issue trackers, CI/CD, and deployment systems only within explicit human authorization in this conversation for the task. Local-only investigation or changes do not grant remote access; reading local remote configuration is allowed.
- A request to inspect a remote object or perform a remote operation authorizes the reads and checks necessary for that task in the corresponding system, including related objects needed to complete it. Do not ask for approval of each necessary tool call or extend this authority to unrelated tasks or systems.
- Changes to remote state, publication, and starting pipelines or deployments require an explicit request for the respective action. Local commits and drafting text grant no such authority. A request to create or open a pull request or merge request does not itself authorize a push.
- Existing authorization persists within the agreed scope. Do not request redundant confirmation unless higher-priority instructions or a tool approval mechanism require it.
- If authority is missing or ambiguous, explain the required action and its purpose and ask before taking the dependent action. Continue independent work that is already allowed.
- Publishing a PR/MR description, including when creating or updating the PR/MR, requires an explicit publication request and the user's confirmation of the full description text first shown in chat. Silence is not approval: take no further action on an unconfirmed draft and send no repeated reminders. Do not overwrite a description published by the user without an explicit request. Pending description approval must not block separately authorized pushes, branch publication, or branch updates.

## Порядок работы с Git

### Рабочие, общие и целевые ветки

- При выполнении порученной задачи по реализации ты можешь создавать рабочие ветки и локальные коммиты, относящиеся к этой задаче. Запрос на анализ, обсуждение или предложение изменения сам по себе не разрешает изменять файлы или создавать коммиты.
- Не используй `main`, `master`, `develop` и другие общие или защищённые ветки для реализации изменений или обычных коммитов. Работай в отдельной рабочей ветке. Определяй остальные общие ветки по указаниям пользователя и инструкциям репозитория.
- Не перемещай указатели общих веток, не переписывай их историю и не удаляй такие ветки без явного запроса пользователя. Читать их историю и использовать их как основу для рабочей ветки разрешено.
- Пользователь лично создаёт и явно называет целевую ветку для интеграции твоей работы. Не создавай эту целевую ветку от его имени и не выбирай её по умолчанию.
- Выполняй слияние своей работы в целевую ветку только по явному запросу пользователя. Такое разрешение включает создание необходимого коммита слияния, но не дальнейшую реализацию изменений непосредственно в целевой ветке.
- Если целевая ветка не указана или не существует, продолжай независимую работу в своей рабочей ветке и отложи слияние.
- Сохраняй существующие изменения пользователя, не включай посторонние изменения в свои коммиты и не переписывай чужую историю без явного запроса.

### Рабочие деревья Git (worktree)

- Для параллельных задач, изменяющих код в одном репозитории, используй отдельную ветку и отдельное рабочее дерево для каждой задачи.
- Создавай рабочее дерево до первого изменения, если нужна изоляция от параллельной работы или существующих незакоммиченных изменений. Анализ и другая работа только на чтение не требуют отдельного рабочего дерева.
- Перед внесением изменений проверяй фактическую ветку и корень текущей рабочей копии; не определяй их только по названию задачи или проекта.

## Минимальные требования к доказательности

Применяй эти требования соразмерно задаче. Этот общий минимум сам по себе не требует вызова навыков трассировки или полного исследования для краткого фактического ответа.

- Сохраняй исходный сценарий, значимые входные данные и ожидаемое поведение; отличай сообщённое пользователем от установленного в ходе работы.
- Обосновывай причинные выводы относящимися к делу источниками и наблюдениями, учитывая значимые границы системы в объёме, необходимом для вывода.
- Различай уровни поведения и уже созданное состояние: сообщение в UI и внешний вызов, например, могут иметь разные результаты; ошибка не означает, что запись ещё не была сохранена.
- Разделяй подтверждённое, гипотезы и предложения. Не утверждай, что проверка или воспроизведение выполнены, если фактически их не выполнял.
- Явно указывай существенные пробелы в доказательствах и ограничения выводов.

