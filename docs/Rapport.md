# Rapport CI/CD – Projet Todo App

## Auteur : Jessica Grisales

## Date : 05.12.2025

## Classe : FID2

# Audit de sécurité des packages

1. Audit Fontend

- npm audit

npm report: @eslint/plugin-kit <0.3.4 est vulnérable à une attaque (ReDos). Car eslint 9.10.0 - 9.26.0 dépend de cette version vulnérable. Si on utilise unversion d'Eslint dans cette fourchette, elle installe automatiquement un plugin-kit vulnérable, même s'il est pas utiliser directement.
Cette partie a une sécurité basse.

Solution: Dans le package.json dans les dépendances "eslint": "^9.13.0". Signifie que n'importe quel version entre >= 9.13.0 et < 10.0.0 sera installé automatiquement. ou tout simplement faire la commande npm audit fix.
