---
title: "Mi primer homelab: cómo empecé con servidores en casa"
description: "Una guía para principiantes sobre cómo montar tu primer homelab con hardware de segunda mano, Proxmox y servicios básicos."
date: 2025-11-15
excerpt: "Te cuento cómo empecé en el mundo del homelab, qué hardware compré y qué servicios corrí los primeros meses."
tags: ["homelab", "proxmox", "linux", "principiantes"]
draft: false
coverImage:
  src: "/images/blog/homelab-starter.jpg"
  alt: "Rack de servidores casero con LEDs azules"
---

## Por qué un homelab

Siempre me llamó la atención tener mi propia infraestructura en casa. No solo por aprender, sino por tener control total sobre mis datos y servicios.

## El hardware inicial

Empecé con un HP EliteDesk 800 G3 refurbished (~$150 USD) con 16 GB de RAM y un SSD de 256 GB. Más que suficiente para aprender.

## Proxmox como hipervisor

Instalé Proxmox VE y en menos de una hora ya tenía mi primer contenedor LXC corriendo un servidor DNS con Pi-hole.

## Primeros servicios

- Pi-hole (DNS + bloqueo de anuncios)
- Nginx Proxy Manager (reverse proxy)
- Portainer (gestión de contenedores)
- Home Assistant (automatización del hogar)