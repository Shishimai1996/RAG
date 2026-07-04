# Understanding This App and RAG

This document explains the structure of the app and what RAG means, so you can ask useful questions about how the system works and how it is built.

## Overview

This app is a simple RAG (Retrieval-Augmented Generation) demo that connects a web frontend to a retrieval system and a language model. It is designed to answer questions using content stored in Markdown files.

## App Structure

- Frontend: Next.js app with a user input field and response display.
- API: A serverless API route handles question requests and forwards them to the LangChain-based backend.
- Embeddings: Documents are converted into vector embeddings and stored in Qdrant.
- Retriever: On each question, the system retrieves relevant documents from Qdrant.
- LLM: The retrieved documents are combined into a prompt and sent to OpenAI for an answer.

## What is RAG?

- RAG stands for Retrieval-Augmented Generation.
- It uses a retrieval engine to fetch relevant documents from a knowledge base.
- These documents are then provided as context to the language model.
- The model generates an answer based on both the query and retrieved content.

## Data Flow

1. Markdown files are loaded from the `data/` folder.
2. The Markdown is embedded using OpenAI embeddings.
3. Embeddings are stored in a Qdrant vector database.
4. When a user asks a question, the retriever fetches the most relevant documents.
5. The selected documents are combined with the question and sent to the language model.
6. The model returns a response that is displayed in the frontend.

## Why Use RAG?

- It grounds the language model in real, user-provided content.
- It helps avoid hallucinations by limiting answers to the retrieved information.
- It enables the app to answer questions based on a specific knowledge base.

## This App's Key Features

- Local Markdown-based knowledge store
- Qdrant vector search for fast retrieval
- OpenAI-powered response generation
- Simple question form and answer display
- Support for English and Japanese via basic localization

## Notes

This app is a starting point for building a career-focused RAG tool. You can expand it by adding more Markdown documents, refining prompts, or integrating additional data sources.
