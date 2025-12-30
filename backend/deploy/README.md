# Backend Deployment Guide

This folder contains deployment configuration for the AquaNova backend.

## Environment Variables

The `.env.production` file in this folder uses Vercel secret references (e.g., `@db_host`).

### Setting Up Vercel Secrets

You need to add these environment variables in your Vercel Dashboard:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your **backend** project
3. Go to **Settings** → **Environment Variables**
4. Add the following variables:

| Variable Name | Description |
|--------------|-------------|
| `DB_HOST` | TiDB database host |
| `DB_PORT` | Database port (usually 4000) |
| `DB_USER` | Database username |
| `DB_PASSWORD` | Database password |
| `DB_NAME` | Database name |
| `JWT_SECRET` | Secret key for JWT tokens |
| `EMAIL_USER` | Email address for sending emails |
| `EMAIL_PASSWORD` | Email app password |
| `NVIDIA_API_KEY` | NVIDIA API key (if using NVIDIA API) |
| `HUGGINGFACE_API_KEY` | Hugging Face API key for AI model |

### Deployment

The backend is configured to deploy automatically when you push to GitHub.

**Manual deployment:**
```bash
cd backend
vercel --prod
```

## Current Configuration

- **API**: Hugging Face Inference API
- **Model**: `nvidia/NVIDIA-Nemotron-3-Nano-30B-A3B-BF16`
- **Database**: TiDB Cloud (MySQL compatible)
- **Deployment**: Vercel Serverless Functions
