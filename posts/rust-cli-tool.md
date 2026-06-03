---
title: "用 Rust 写了一个 CLI 小工具"
date: "2026-04-15"
excerpt: "记录用 Rust 开发命令行工具的过程，从环境搭建到发布 crate 的完整踩坑记录。"
category: "project"
tags: ["Rust", "CLI"]
---

## 起因

一直想学 Rust，但每次看完教程就忘了。最好的学习方式就是动手做项目，所以我决定写一个实用的 CLI 小工具。

## 技术选型

Rust 的 CLI 生态非常成熟：

- **clap**：命令行参数解析，API 设计优雅
- **serde**：序列化/反序列化，Rust 的标配
- **tokio**：异步运行时

```rust
use clap::Parser;

#[derive(Parser)]
#[command(name = "qblog")]
struct Cli {
    /// 文章标题
    title: String,
    /// 分类
    #[arg(short, long)]
    category: Option<String>,
}
```

## 遇到的一些坑

### 1. 生命周期问题

Rust 的生命周期标注一开始让人很头疼。不过写多了之后，编译器报错反而成了最好的老师。

### 2. 错误处理

从 `unwrap()` 到 `?` 操作符，再到自定义错误类型，每一步都是对 Rust 错误处理理念的深入理解。

## 总结

项目虽小，但对 Rust 的理解深了很多。下一步计划把这个工具做成一个完整的博客 CLI 管理工具。

> 学习一门语言的最好方式，就是用这门语言解决一个真实的问题。
