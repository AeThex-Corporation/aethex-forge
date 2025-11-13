# NLP with Transformers & Large Language Models

## Table of Contents

1. [Introduction to NLP & Transformers](#introduction)
2. [Understanding Transformer Architecture](#transformers)
3. [Pre-trained Language Models](#pretrained)
4. [Fine-tuning & Transfer Learning](#finetuning)
5. [Working with LLMs](#llms)
6. [Advanced Techniques](#advanced)
7. [Production Deployment](#deployment)
8. [Future Directions](#future)

## Introduction to NLP & Transformers

Natural Language Processing (NLP) has undergone a revolutionary transformation with the introduction of Transformer models. This course covers the state-of-the-art techniques for working with transformers and large language models (LLMs).

### Evolution of NLP

Historical progression:

- **Statistical NLP**: Rule-based and probabilistic models
- **Word Embeddings**: Word2Vec, GloVe (2013-2015)
- **RNNs/LSTMs**: Sequential processing (2014-2016)
- **Attention Mechanism**: Vaswani et al., 2017
- **Transformers**: Parallel processing revolution
- **Large Language Models**: GPT, BERT, T5, and beyond

### Why Transformers?

Key advantages:

- Parallel processing capability
- Better long-range dependencies
- Easier to scale to large datasets
- Transfer learning friendly
- State-of-the-art performance across tasks

## Understanding Transformer Architecture

### Self-Attention Mechanism

The core innovation of transformers:

```python
import torch
import torch.nn.functional as F

def scaled_dot_product_attention(query, key, value, mask=None):
    """
    Compute scaled dot-product attention.
    
    Args:
        query: (batch, seq_len, d_k)
        key: (batch, seq_len, d_k)
        value: (batch, seq_len, d_v)
        mask: Optional mask to prevent attention to certain positions
    
    Returns:
        output: (batch, seq_len, d_v)
        attention_weights: (batch, seq_len, seq_len)
    """
    d_k = query.shape[-1]
    
    # Compute attention scores
    scores = torch.matmul(query, key.transpose(-2, -1)) / torch.sqrt(torch.tensor(d_k, dtype=torch.float32))
    
    # Apply mask if provided
    if mask is not None:
        scores = scores.masked_fill(mask == 0, float('-inf'))
    
    # Apply softmax
    attention_weights = F.softmax(scores, dim=-1)
    
    # Compute output
    output = torch.matmul(attention_weights, value)
    
    return output, attention_weights
```

### Multi-Head Attention

Parallel attention representations:

```python
import torch
import torch.nn as nn

class MultiHeadAttention(nn.Module):
    def __init__(self, d_model, num_heads):
        super().__init__()
        assert d_model % num_heads == 0, "d_model must be divisible by num_heads"
        
        self.d_model = d_model
        self.num_heads = num_heads
        self.d_k = d_model // num_heads
        
        # Linear layers for projections
        self.W_q = nn.Linear(d_model, d_model)
        self.W_k = nn.Linear(d_model, d_model)
        self.W_v = nn.Linear(d_model, d_model)
        self.W_o = nn.Linear(d_model, d_model)
    
    def forward(self, query, key, value, mask=None):
        batch_size = query.shape[0]
        
        # Project and split into heads
        Q = self.W_q(query).view(batch_size, -1, self.num_heads, self.d_k).transpose(1, 2)
        K = self.W_k(key).view(batch_size, -1, self.num_heads, self.d_k).transpose(1, 2)
        V = self.W_v(value).view(batch_size, -1, self.num_heads, self.d_k).transpose(1, 2)
        
        # Apply attention
        attn_output, _ = scaled_dot_product_attention(Q, K, V, mask)
        
        # Concatenate heads
        attn_output = attn_output.transpose(1, 2).contiguous()
        attn_output = attn_output.view(batch_size, -1, self.d_model)
        
        # Final linear projection
        output = self.W_o(attn_output)
        
        return output
```

### Complete Transformer Block

Full encoder/decoder architecture:

```python
class TransformerBlock(nn.Module):
    def __init__(self, d_model, num_heads, d_ff, dropout_rate=0.1):
        super().__init__()
        
        self.attention = MultiHeadAttention(d_model, num_heads)
        self.feed_forward = nn.Sequential(
            nn.Linear(d_model, d_ff),
            nn.ReLU(),
            nn.Linear(d_ff, d_model)
        )
        
        self.norm1 = nn.LayerNorm(d_model)
        self.norm2 = nn.LayerNorm(d_model)
        self.dropout = nn.Dropout(dropout_rate)
    
    def forward(self, x, mask=None):
        # Self-attention with residual connection
        attn_output = self.attention(x, x, x, mask)
        x = self.norm1(x + self.dropout(attn_output))
        
        # Feed-forward with residual connection
        ff_output = self.feed_forward(x)
        x = self.norm2(x + self.dropout(ff_output))
        
        return x
```

## Pre-trained Language Models

### BERT (Bidirectional Encoder Representations)

```python
from transformers import BertTokenizer, BertModel
import torch

# Load pre-trained BERT
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
model = BertModel.from_pretrained('bert-base-uncased')

# Tokenize input
text = "The cat sat on the mat"
tokens = tokenizer(text, return_tensors='pt')

# Get embeddings
with torch.no_grad():
    outputs = model(**tokens)
    last_hidden_state = outputs.last_hidden_state
    pooled_output = outputs.pooler_output

print(f"Sequence length: {last_hidden_state.shape[1]}")
print(f"Hidden dimension: {last_hidden_state.shape[2]}")
```

### GPT (Generative Pre-trained Transformer)

```python
from transformers import GPT2Tokenizer, GPT2LMHeadModel

# Load GPT-2
tokenizer = GPT2Tokenizer.from_pretrained('gpt2')
model = GPT2LMHeadModel.from_pretrained('gpt2')

# Generate text
prompt = "The future of AI is"
input_ids = tokenizer.encode(prompt, return_tensors='pt')

# Generate with constraints
output = model.generate(
    input_ids,
    max_length=100,
    num_return_sequences=3,
    temperature=0.7,
    top_p=0.9,
    no_repeat_ngram_size=2
)

for i, sample in enumerate(output):
    print(f"Sample {i+1}:")
    print(tokenizer.decode(sample, skip_special_tokens=True))
```

### T5 (Text-to-Text Transfer Transformer)

```python
from transformers import T5Tokenizer, T5ForConditionalGeneration

# Load T5
tokenizer = T5Tokenizer.from_pretrained('t5-base')
model = T5ForConditionalGeneration.from_pretrained('t5-base')

# T5 prefix-based tasks
tasks = {
    'translate': 'translate English to French: The quick brown fox',
    'summarize': 'summarize: The quick brown fox jumps over the lazy dog',
    'question': 'question: What is the capital of France?'
}

for task, input_text in tasks.items():
    input_ids = tokenizer(input_text, return_tensors='pt').input_ids
    
    output = model.generate(input_ids, max_length=50)
    result = tokenizer.decode(output[0], skip_special_tokens=True)
    
    print(f"{task}: {result}")
```

## Fine-tuning & Transfer Learning

### Fine-tuning BERT for Classification

```python
from transformers import BertForSequenceClassification, Trainer, TrainingArguments
from datasets import load_dataset

# Load dataset
dataset = load_dataset('imdb')

# Load model for classification
model = BertForSequenceClassification.from_pretrained('bert-base-uncased', num_labels=2)

# Define training arguments
training_args = TrainingArguments(
    output_dir='./results',
    num_train_epochs=3,
    per_device_train_batch_size=8,
    per_device_eval_batch_size=8,
    warmup_steps=500,
    weight_decay=0.01,
    logging_dir='./logs',
    learning_rate=2e-5,
)

# Create trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=dataset['train'],
    eval_dataset=dataset['test'],
)

# Train
trainer.train()

# Evaluate
eval_results = trainer.evaluate()
print(f"Accuracy: {eval_results['eval_accuracy']:.4f}")
```

### Fine-tuning with LoRA (Low-Rank Adaptation)

Efficient fine-tuning for large models:

```python
from peft import LoraConfig, get_peft_model
from transformers import AutoModelForCausalLM

# Load base model
base_model = AutoModelForCausalLM.from_pretrained('gpt2')

# Configure LoRA
lora_config = LoraConfig(
    r=8,
    lora_alpha=16,
    lora_dropout=0.05,
    bias='none',
    task_type='CAUSAL_LM',
    target_modules=['c_attn', 'c_proj']
)

# Get PEFT model
model = get_peft_model(base_model, lora_config)

# Only train LoRA parameters
trainable_params = sum(p.numel() for p in model.parameters() if p.requires_grad)
print(f"Trainable parameters: {trainable_params:,}")
```

## Working with LLMs

### Using LLM APIs

```python
import anthropic
import openai

# Using Claude API
client = anthropic.Anthropic(api_key="your-api-key")

message = client.messages.create(
    model="claude-3-sonnet-20240229",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Explain transformers in simple terms"}
    ]
)

print(message.content[0].text)

# Using OpenAI API
openai.api_key = "your-api-key"

response = openai.ChatCompletion.create(
    model="gpt-4",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "What is machine learning?"}
    ],
    temperature=0.7
)

print(response.choices[0].message.content)
```

### Prompt Engineering

Techniques for better results:

```python
def few_shot_prompt(examples, query):
    """Few-shot learning example"""
    prompt = "Classify the following sentiment:\n\n"
    
    for example in examples:
        prompt += f"Text: {example['text']}\nSentiment: {example['sentiment']}\n\n"
    
    prompt += f"Text: {query}\nSentiment:"
    return prompt

examples = [
    {"text": "This movie is great!", "sentiment": "Positive"},
    {"text": "I didn't enjoy the book.", "sentiment": "Negative"},
]

query = "The game is amazing"
prompt = few_shot_prompt(examples, query)
```

### Retrieval-Augmented Generation (RAG)

Combining LLMs with external knowledge:

```python
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import FAISS
from langchain.text_splitter import CharacterTextSplitter
from langchain.llms import OpenAI
from langchain.chains import RetrievalQA

# Load documents
documents = load_documents("path/to/documents")

# Split documents
text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
docs = text_splitter.split_documents(documents)

# Create embeddings
embeddings = HuggingFaceEmbeddings()

# Create vector store
vectorstore = FAISS.from_documents(docs, embeddings)

# Create QA chain
llm = OpenAI()
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=vectorstore.as_retriever()
)

# Query
result = qa_chain.run("What is the main topic?")
print(result)
```

## Advanced Techniques

### Quantization for Efficiency

```python
from transformers import AutoModelForCausalLM, BitsAndBytesConfig
import torch

# Configure quantization
quantization_config = BitsAndBytesConfig(
    load_in_8bit=True,
    bnb_8bit_compute_dtype=torch.float16,
)

# Load quantized model
model = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Llama-2-7b",
    quantization_config=quantization_config,
    device_map="auto"
)

# Model now uses 8-bit precision, reducing memory by ~4x
```

### Multi-GPU Training

```python
from torch.nn import DataParallel
import torch.distributed as dist
from torch.nn.parallel import DistributedDataParallel as DDP

# Initialize distributed training
dist.init_process_group(backend='nccl')

model = model.to(torch.device('cuda', rank))
model = DDP(model, device_ids=[rank])

# Training continues as normal
# Loss is automatically synchronized across GPUs
```

## Production Deployment

### Model Serving

```python
from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline

app = FastAPI()

# Load model once
classifier = pipeline(
    "text-classification",
    model="distilbert-base-uncased-finetuned-sst-2-english"
)

class TextInput(BaseModel):
    text: str

@app.post("/classify")
async def classify_text(input: TextInput):
    result = classifier(input.text)
    return {
        "text": input.text,
        "label": result[0]["label"],
        "score": result[0]["score"]
    }

# Run with: uvicorn app:app --reload
```

## Future Directions

The field of NLP continues to evolve rapidly:

- **Multimodal Models**: Combining text, images, and audio
- **Efficient Models**: Smaller, faster alternatives to large LLMs
- **Reasoning**: Better handling of complex logical tasks
- **Interpretability**: Understanding model decisions
- **Real-time Adaptation**: Updating knowledge without retraining

Master these foundational concepts and you'll be well-positioned to work with cutting-edge NLP technologies.
