---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: a5cd9ed4f96ee69267f2a3b930c2bccf_73692280653a11f1a4b9525400d9a7a1
    ReservedCode1: 0Cr4QCfTQ/AZfQuo36D7wFDj/R6LdoKXR5hJRHWPTxaTiPx47N0cVkrhKwzMkJ1pNFmaAKBHuzWCAgHQWV/Ut8VOgi3vW8DmZehW3cejg5kLcE/YrcdaZZqhDO38LeWVww8iD8GuqiSvJBGNwPY5hoj21RTgcz0b9auzsonrKxUaseyOndoWi7k5icI=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: a5cd9ed4f96ee69267f2a3b930c2bccf_73692280653a11f1a4b9525400d9a7a1
    ReservedCode2: 0Cr4QCfTQ/AZfQuo36D7wFDj/R6LdoKXR5hJRHWPTxaTiPx47N0cVkrhKwzMkJ1pNFmaAKBHuzWCAgHQWV/Ut8VOgi3vW8DmZehW3cejg5kLcE/YrcdaZZqhDO38LeWVww8iD8GuqiSvJBGNwPY5hoj21RTgcz0b9auzsonrKxUaseyOndoWi7k5icI=
---

# 数据目录 (data/)

本目录用于存放应用运行过程中产生的持久化数据文件。

## 作用

- **数据备份存储**：通过设置中的「导出数据」功能，可将学习数据导出到此目录
- **跨环境迁移**：复制整个项目文件夹到新环境时，本目录中的数据文件会一并迁移
- **版本管理**：建议将本目录加入 `.gitignore`（如果使用 Git），或定期手动备份

## 文件说明

| 文件 | 说明 |
|------|------|
| `english-study-backup-YYYY-MM-DD.json` | 学习数据备份文件（导出时生成） |

## 数据迁移方法

1. 在旧环境中打开应用 → 设置 → 导出数据 → 保存到 `data/` 目录
2. 复制整个项目文件夹到新环境
3. 在新环境中打开应用 → 设置 → 导入数据 → 选择 `data/` 目录中的备份文件

## 注意事项

- 应用运行时数据存储在浏览器 `localStorage` 中，不受本目录影响
- 本目录仅用于数据备份和迁移，不会自动与 `localStorage` 同步
- 推荐使用本地 HTTP 服务器运行应用，以获得更好的文件系统访问体验：

```bash
python -m http.server 8080
# 浏览器访问 http://localhost:8080
```
*（内容由AI生成，仅供参考）*
