# Contributing to Logistics & Transport Management System

First off, thank you for considering contributing to this project! It's people like you who make the open-source community such an amazing place to learn, inspire, and create.

## 🏷️ Issue Labels

We use labels to categorize issues and pull requests. Here are the primary ones you'll see:

- `bug`: Something isn't working as expected.
- `feature`: A request for a brand-new feature.
- `enhancement`: An improvement to an existing feature or piece of code.
- `documentation`: Changes to documentation (like this file!).
- `help wanted`: The maintainers would appreciate extra help on this.
- `good first issue`: Great for newcomers to the project.

## 🔄 Development Workflow

To contribute code or documentation, please follow these steps:

1. **Fork the Repository**: Create your own copy of the project on GitHub.
2. **Clone the Fork**: Download your copy to your local machine.
   ```bash
   git clone https://github.com/your-username/logistics-transport-system.git
   ```
3. **Create a Branch**: Always work on a new branch for your changes.
   ```bash
   git checkout -b feature/your-feature-name
   # OR
   git checkout -b fix/your-bug-fix-name
   ```
4. **Make Your Changes**: Implement your feature or fix. Ensure your code follows the project's style and is well-commented.
5. **Commit Your Changes**: Use clear and descriptive commit messages.
   ```bash
   git commit -m "feat: add capacity validation to truck posting"
   ```
6. **Push to GitHub**: Push your branch to your fork.
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Open a Pull Request**: Navigate to the original repository and open a PR from your fork's branch.

## 📝 Template Usage

### Issue Templates
When opening a new issue, please use the provided templates if available. This helps us gather all the necessary information (like steps to reproduce a bug or the "why" behind a feature request) quickly.

### Pull Request Template
When submitting a PR, please fill out the PR template. Be sure to:
- Reference the issue number being addressed.
- Provide a clear description of the changes.
- Include screenshots or GIFs if the UI has changed.

## 💻 Coding Standards

- **Backend**: Follow the modular structure (routes, models, middleware). Use the `asyncHandler` for all async routes.
- **Frontend**: Use functional components and hooks. Keep styles organized within the component files or shared utility files.
- **Linting**: Run the linter before committing to ensure code consistency.
  ```bash
  npm run lint
  ```

## ❓ Questions?

If you have any questions, feel free to open an issue with the `help wanted` label or reach out to the maintainers.

Happy coding! 🚚