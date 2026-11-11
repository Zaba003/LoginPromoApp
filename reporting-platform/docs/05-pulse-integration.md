# 05. Контракт последующей интеграции с Pulse

## Независимость
Платформа стартует со своей авторизацией и отдельной БД. Pulse не должен читать таблицы отчётности напрямую; только API и события. Отчётность не должна зависеть от доступности Pulse.

## Возможные уровни интеграции
1. **SSO через OIDC**: единый вход, но отдельная авторизация к объектам отчётности. Временный локальный режим только по политике ИБ.
2. **Справочники**: синхронизация сотрудников/подразделений; внешний id + источник + временные границы, защита от переименований.
3. **Навигация**: глубокие ссылки `reporting/...` из Pulse; общий визуальный стиль и возможность встраивания через безопасный маршрут/reverse proxy.
4. **Задачи/уведомления**: события отчётности через outbox/webhook или шину, дедупликация по event id.
5. **Сквозные данные**: ограниченный REST API для чтения агрегатов по scope/permission; без обхода прав.

## Предлагаемые REST endpoints (контракт-кандидат)
```
GET    /api/v1/me/assignments
GET    /api/v1/campaigns/{id}
GET    /api/v1/forms/{versionId}
PUT    /api/v1/submissions/{id}/draft
POST   /api/v1/submissions/{id}/submit
POST   /api/v1/submissions/{id}/approve
POST   /api/v1/submissions/{id}/request-changes
POST   /api/v1/consolidations
GET    /api/v1/consolidations/{id}/lineage
POST   /api/v1/consolidations/{id}/render
GET    /api/v1/documents/{id}/download
```

## Безопасность
- API не передаёт доверие на основании одного заголовка user id; проверяется токен/контекст identity provider.
- RBAC `module:action` **плюс** object/department scope; серверная авторизация на каждом чтении и изменении.
- Разные аудитории: организации, отделы, исполнители, проверяющие. Отчёты по умолчанию закрыты.
- Service-to-service доступ с ограниченными scopes, аудитом, сроками жизни токенов и управлением секретами.
- События: `reporting.assignment.created.v1`, `reporting.submission.submitted.v1`, `reporting.approval.completed.v1`, `reporting.campaign.overdue.v1`.
- При интеграции сохранить идентичность события, иначе повторы приведут к дублированию задач.

## Открытые вопросы
Реальный провайдер SSO Pulse, модель оргструктуры, список разрешённых протоколов внутреннего контура, каталог прав и UX встраивания — уточнить после технического обследования Pulse.
