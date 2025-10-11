#!/bin/bash

# Exemplo de interpretação de parâmetros estilo var=valor
for ARG in "$@"; do
  eval "$ARG"
done

echo "Enviando e-mail para $to com assunto '$subject'"
