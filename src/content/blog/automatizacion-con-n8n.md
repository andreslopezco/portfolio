---
title: "Automatización con n8n: conecta todo sin código"
description: "Cómo usar n8n para automatizar flujos de trabajo entre servicios como Telegram, Google Sheets y APIs REST."
date: 2025-12-03
excerpt: "n8n es una herramienta poderosa para automatizar tareas. Acá te muestro los workflows que uso en mi día a día."
tags: ["automatizacion", "n8n", "devops", "productividad"]
draft: false
coverImage:
  src: "/images/blog/n8n-workflows.jpg"
  alt: "Dashboard de n8n mostrando workflows activos"
---

## ¿Qué es n8n?

n8n es una plataforma de automatización de flujos de trabajo (workflows) open source. Similar a Zapier o Make, pero corre en tu propia infraestructura.

## Por qué self-hosted

- Control total de tus datos
- Sin límites artificiales de ejecución
- Integraciones con APIs internas
- Sin costos mensuales por plan

## Mis workflows favoritos

### 1. Alertas de precios
Un webhook de MercadoLibre envía notificaciones a Telegram cuando un producto baja de precio.

### 2. Backup automático
Cada noche, n8n hace snapshots de mis bases de datos y los sube a un bucket de S3 compatible.

### 3. Resumen de redes sociales
Recojo tweets y posts de LinkedIn sobre IA y automatización, los proceso con GPT-4o mini y genero un resumen diario que me llega por Telegram.