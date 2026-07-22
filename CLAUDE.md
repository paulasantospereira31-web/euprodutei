# Instruções para o Claude neste repositório

## Projeto

Site estático (HTML/CSS/JS puro, sem build, sem framework) do "Eu
Produtei", hospedado no Netlify a partir da branch `main` deste repo,
no domínio euprodutei.com.br. Detalhes completos da arquitetura,
estrutura de pastas e de cada funcionalidade em `DOCUMENTATION.md` —
leia esse arquivo antes de mexer em algo que você não conhece ainda.

## Regra permanente: manter a documentação técnica em dia

Sempre que você fizer qualquer mudança de código, estrutura de pastas
ou funcionalidade neste projeto — nesta sessão ou em qualquer sessão
futura —, você deve:

1. **Atualizar `DOCUMENTATION.md`** para refletir a mudança antes de
   considerar a tarefa concluída. Isso inclui, por exemplo: adicionar
   um artigo novo, mudar como os likes/analytics funcionam, mudar a
   stack, adicionar uma página, mudar o processo de deploy, mudar a
   estrutura de pastas, etc. Se a mudança não afeta nada do que está
   documentado, não é preciso alterar o arquivo — mas verifique antes
   de assumir isso.
2. **Sinalizar isso claramente ao final da sua resposta ao usuário**,
   em uma linha separada, por exemplo:
   `Documentação técnica atualizada em DOCUMENTATION.md`
   Se nenhuma atualização foi necessária, diga isso explicitamente
   também (ex.: "Documentação técnica não precisou de alterações desta
   vez"), em vez de simplesmente omitir o assunto.

Essa regra vale independentemente de quem pediu a mudança ou de qual
sessão está rodando — é uma instrução permanente do projeto, não
específica de uma conversa.
