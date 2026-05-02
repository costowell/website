---
id: deploy-nixos
title: 'OS Agnostic NixOS Deploying'
date: 2026-05-01T00:00:00-05:00
summary: 'How to deploy to a NixOS server without installing Nix to your host machine.'
layout: blog
---

This might be a hot take, but I think NixOS is only good as a server operating system. I've tried to daily drive it - its just such a hassle. If I'm spending more time configuring or trying to work around my computer than I am using it, its not worth it.

However, Nix has kind of an ecosystem going. I use a tool called [deploy-rs](https://github.com/serokell/deploy-rs) to help deploy updates to my server. It has a couple other handy features like [automatic and magic rollback](https://github.com/serokell/deploy-rs#ideas), but overall its a nice wrapper around `nixos-rebuild` which I like.

Both `nixos-rebuild` and `deploy-rs` require the host have Nix installed, but that's another pain point - I don't want Nix to touch my host system. Two package managers with two different approaches to package management sounds like a recipe for a _really_ messy system that I'm not going to want to fix. Less is more.

So I don't want to use NixOS or install Nix on anything but my server. How am I going to take advantage of the Nix ecosystem?

**Containers, of course!**

This performs a similar function that a Python virtual environment does - why would you mess with your host system packages to get a single piece of software running?

The best part? Its a tiny script.

```sh
#!/bin/bash
set -e

VOLUME_NAME="nix-config-store"
FISH_VOLUME="nix-config-fish-history"

if ! podman volume exists "$VOLUME_NAME" 2>/dev/null; then
    podman volume create "$VOLUME_NAME"
fi

if ! podman volume exists "$FISH_VOLUME" 2>/dev/null; then
    podman volume create "$FISH_VOLUME"
fi

exec podman run -it --rm \
    -v "$VOLUME_NAME:/nix" \
    -v "$(cd "$(dirname "$0")" && pwd):/config:Z" \
    -v "$FISH_VOLUME:/root/.local/share/fish" \
    -v "$HOME/.ssh:/root/.ssh:ro" \
    -v "$(readlink -f "$HOME/.ssh/config"):/root/.ssh/config:ro" \
    -v "$SSH_AUTH_SOCK:/run/ssh-agent.sock" \
    -e SSH_AUTH_SOCK=/run/ssh-agent.sock \
    -e NIX_CONFIG="build-users-group =" \
    -w /config \
    docker.io/nixos/nix \
    sh -c "nix --extra-experimental-features 'nix-command flakes' develop --command fish"
```

There's some extra fluff to keep my shell history, but otherwise that's it.

With containers, I get an OS agonstic way to easily deploy to my server from any of my machines!
