import re

with open("src/data/questions.js", "r", encoding="utf-8") as f:
    content = f.read()

q_exprs = set(re.findall(r'"questionExpression":\s*"([^"]+)"', content))
opt_exprs = set(re.findall(r'"expression":\s*"([^"]+)"', content))

print("Question Expressions:", sorted(list(q_exprs)))
print("Option Expressions:", sorted(list(opt_exprs)))
