# github-lab

## Token d'accès personnel (PAT) fine-grained

Pour contribuer à ce dépôt via des branches et des Pull Requests (cas le plus courant), créer un PAT *fine-grained* limité à ce seul dépôt.

### Création

1. GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Fine-grained tokens** → **Generate new token**.
2. **Resource owner** : le propriétaire du dépôt.
3. **Repository access** : *Only select repositories* → sélectionner `github-lab`.
4. Définir une date d'expiration courte.
5. Configurer les permissions ci-dessous.

### Permissions du dépôt

| Permission | Accès | Usage |
| --- | --- | --- |
| Contents | Read and write | Pousser des branches, créer des commits |
| Pull requests | Read and write | Ouvrir et commenter des PR |
| Issues | Read and write | Créer ou commenter des issues (optionnel, seulement si nécessaire) |
| Metadata | Read | Obligatoire, ajoutée automatiquement |

### Bonnes pratiques

- Ne jamais committer le token ni l'écrire dans un fichier du dépôt. Le stocker dans un gestionnaire de secrets ou le trousseau du système.
- Ne pas accorder d'autres permissions que celles listées.
- Révoquer et régénérer le token à son expiration ou en cas de fuite.

## Utiliser le PAT avec un dépôt en HTTPS

Avec HTTPS, Git demande un identifiant et un mot de passe. Le mot de passe est le PAT, pas le mot de passe du compte GitHub.

### Cloner le dépôt

```sh
git clone https://github.com/<proprietaire>/github-lab.git
cd github-lab
```

À la demande d'authentification :

- **Username** : le nom d'utilisateur GitHub.
- **Password** : le PAT.

### Mémoriser le token dans un gestionnaire d'identifiants

Pour éviter de le saisir à chaque opération, utiliser un credential helper qui stocke le token de façon sécurisée.

macOS (trousseau) :

```sh
git config --global credential.helper osxkeychain
```

Windows :

```sh
git config --global credential.helper manager
```

Linux (avec libsecret) :

```sh
git config --global credential.helper libsecret
```

Le token est enregistré à la première authentification réussie. Éviter `credential.helper store`, qui l'écrit en clair dans `~/.git-credentials`.

### Dépôt déjà cloné en SSH

Passer l'URL du remote en HTTPS :

```sh
git remote set-url origin https://github.com/<proprietaire>/github-lab.git
git remote -v
```

### Contribuer via une branche et une PR

```sh
git switch -c ma-branche
git add .
git commit -m "Description du changement"
git push -u origin ma-branche
```

Ouvrir ensuite la Pull Request depuis GitHub.

### Remplacer un token expiré ou révoqué

Si Git renvoie `Authentication failed` ou `403`, supprimer l'ancien token du gestionnaire d'identifiants (macOS : application **Keychain Access**, entrée `github.com`), puis relancer une opération Git et saisir le nouveau PAT.

Sur macOS, en ligne de commande :

```sh
printf 'protocol=https\nhost=github.com\n\n' | git credential reject
```

### À ne pas faire

- Ne pas mettre le token dans l'URL du remote (`https://<token>@github.com/...`). Il serait visible dans `.git/config` et dans l'historique du shell.
- Ne pas committer le token ni le coller dans une issue ou une PR.
