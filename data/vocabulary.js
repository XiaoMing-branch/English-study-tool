// 外部词库文件 - 工程启动时从此文件加载单词数据
// 如需添加单词，按相同格式追加到数组中即可
window.__EST_EXTERNAL_VOCAB__ = [
  {
    "id": "pb001",
    "en": "variable",
    "cn": "变量",
    "cat": "programming-basics",
    "def": "程序中用于存储数据的命名存储位置",
    "ex": "int counter = 0;",
    "diff": 1
  },
  {
    "id": "pb002",
    "en": "constant",
    "cn": "常量",
    "cat": "programming-basics",
    "def": "值在程序执行期间不可改变的量",
    "ex": "const int MAX = 100;",
    "diff": 1
  },
  {
    "id": "pb003",
    "en": "function",
    "cn": "函数",
    "cat": "programming-basics",
    "def": "执行特定任务的可重用代码块",
    "ex": "void setup() { }",
    "diff": 1
  },
  {
    "id": "pb004",
    "en": "parameter",
    "cn": "参数",
    "cat": "programming-basics",
    "def": "传递给函数的值",
    "ex": "void delay(int ms)",
    "diff": 1
  },
  {
    "id": "pb005",
    "en": "return",
    "cn": "返回",
    "cat": "programming-basics",
    "def": "函数执行完毕后回传值给调用者",
    "ex": "return 0;",
    "diff": 1
  },
  {
    "id": "pb006",
    "en": "loop",
    "cn": "循环",
    "cat": "programming-basics",
    "def": "重复执行一段代码直到条件不满足",
    "ex": "while(1){ }",
    "diff": 1
  },
  {
    "id": "pb007",
    "en": "condition",
    "cn": "条件",
    "cat": "programming-basics",
    "def": "决定程序分支执行的判断表达式",
    "ex": "if(x > 0)",
    "diff": 1
  },
  {
    "id": "pb008",
    "en": "statement",
    "cn": "语句",
    "cat": "programming-basics",
    "def": "程序中的一条完整指令",
    "ex": "x = x + 1;",
    "diff": 1
  },
  {
    "id": "pb009",
    "en": "expression",
    "cn": "表达式",
    "cat": "programming-basics",
    "def": "可求值产生结果的一段代码",
    "ex": "a + b * c",
    "diff": 2
  },
  {
    "id": "pb010",
    "en": "operator",
    "cn": "运算符",
    "cat": "programming-basics",
    "def": "执行数学或逻辑操作的符号",
    "ex": "+ - * / & |",
    "diff": 1
  },
  {
    "id": "pb011",
    "en": "assignment",
    "cn": "赋值",
    "cat": "programming-basics",
    "def": "将值存储到变量中的操作",
    "ex": "x = 10;",
    "diff": 1
  },
  {
    "id": "pb012",
    "en": "declaration",
    "cn": "声明",
    "cat": "programming-basics",
    "def": "告诉编译器变量或函数的名称和类型",
    "ex": "extern int count;",
    "diff": 2
  },
  {
    "id": "pb013",
    "en": "definition",
    "cn": "定义",
    "cat": "programming-basics",
    "def": "为变量分配内存或为函数提供实现",
    "ex": "int count = 0;",
    "diff": 2
  },
  {
    "id": "pb014",
    "en": "initialization",
    "cn": "初始化",
    "cat": "programming-basics",
    "def": "在声明变量时赋予初始值",
    "ex": "int x = 0;",
    "diff": 2
  },
  {
    "id": "pb015",
    "en": "scope",
    "cn": "作用域",
    "cat": "programming-basics",
    "def": "变量在程序中可被访问的范围",
    "ex": "{ int local; }",
    "diff": 2
  },
  {
    "id": "pb016",
    "en": "comment",
    "cn": "注释",
    "cat": "programming-basics",
    "def": "代码中不被编译器执行的说明文字",
    "ex": "// this is a comment",
    "diff": 1
  },
  {
    "id": "pb017",
    "en": "keyword",
    "cn": "关键字",
    "cat": "programming-basics",
    "def": "编程语言中具有特殊含义的保留字",
    "ex": "int, if, for, while",
    "diff": 1
  },
  {
    "id": "pb018",
    "en": "syntax",
    "cn": "语法",
    "cat": "programming-basics",
    "def": "编程语言的书写规则和结构",
    "ex": "",
    "diff": 1
  },
  {
    "id": "pb019",
    "en": "algorithm",
    "cn": "算法",
    "cat": "programming-basics",
    "def": "解决特定问题的步骤序列",
    "ex": "",
    "diff": 2
  },
  {
    "id": "pb020",
    "en": "logic",
    "cn": "逻辑",
    "cat": "programming-basics",
    "def": "程序中条件判断和控制的推理过程",
    "ex": "if(a && b)",
    "diff": 2
  },
  {
    "id": "pb021",
    "en": "input",
    "cn": "输入",
    "cat": "programming-basics",
    "def": "程序从外部接收数据",
    "ex": "scanf()",
    "diff": 1
  },
  {
    "id": "pb022",
    "en": "output",
    "cn": "输出",
    "cat": "programming-basics",
    "def": "程序向外部发送数据",
    "ex": "printf()",
    "diff": 1
  },
  {
    "id": "pb023",
    "en": "error",
    "cn": "错误",
    "cat": "programming-basics",
    "def": "程序执行中出现的异常情况",
    "ex": "",
    "diff": 1
  },
  {
    "id": "pb024",
    "en": "exception",
    "cn": "异常",
    "cat": "programming-basics",
    "def": "程序运行时的非正常事件",
    "ex": "",
    "diff": 2
  },
  {
    "id": "pb025",
    "en": "library",
    "cn": "库",
    "cat": "programming-basics",
    "def": "预先编写好的可重用代码集合",
    "ex": "#include <stdio.h>",
    "diff": 2
  },
  {
    "id": "dt001",
    "en": "integer",
    "cn": "整数",
    "cat": "data-types",
    "def": "不带小数部分的数值类型",
    "ex": "int count = 5;",
    "diff": 1
  },
  {
    "id": "dt002",
    "en": "float",
    "cn": "浮点数",
    "cat": "data-types",
    "def": "带小数部分的数值类型",
    "ex": "float voltage = 3.3;",
    "diff": 1
  },
  {
    "id": "dt003",
    "en": "double",
    "cn": "双精度浮点数",
    "cat": "data-types",
    "def": "比float精度更高的浮点数类型",
    "ex": "double pi = 3.1415926535;",
    "diff": 2
  },
  {
    "id": "dt004",
    "en": "char",
    "cn": "字符",
    "cat": "data-types",
    "def": "存储单个字符的数据类型",
    "ex": "char c = 'A';",
    "diff": 1
  },
  {
    "id": "dt005",
    "en": "string",
    "cn": "字符串",
    "cat": "data-types",
    "def": "由多个字符组成的文本序列",
    "ex": "char msg[] = \\",
    "diff": 1
  },
  {
    "id": "dt006",
    "en": "boolean",
    "cn": "布尔值",
    "cat": "data-types",
    "def": "只有真(true)或假(false)两种值",
    "ex": "bool flag = true;",
    "diff": 1
  },
  {
    "id": "dt007",
    "en": "array",
    "cn": "数组",
    "cat": "data-types",
    "def": "相同类型元素的连续存储集合",
    "ex": "",
    "diff": 1
  }
];
