# Documentation

Welcome to the Mutabiq AI Frontend documentation!

## 📚 Available Documents

### 1. Quick Reference
**File:** `QUICK_REFERENCE.md`
**Use for:** Quick lookup of utility functions and import statements
- Copy-paste ready code snippets
- Common patterns and examples
- Migration checklist

### 2. Refactoring Guide
**File:** `REFACTORING_GUIDE.md`
**Use for:** Step-by-step migration instructions
- Before/after code examples
- Detailed migration steps for each pattern
- Testing strategies
- Common pitfalls to avoid

### 3. Refactoring Summary
**File:** `REFACTORING_SUMMARY.md`
**Use for:** High-level overview and status
- What was created and why
- Impact summary
- Next steps and priorities
- Team adoption guidelines

---

## 🎯 Which Document Should I Read?

### I'm implementing a new feature
→ Read: `QUICK_REFERENCE.md`
- Get utility imports and usage examples
- See common patterns
- Copy-paste ready code

### I'm migrating an existing component
→ Read: `REFACTORING_GUIDE.md`
- Follow step-by-step instructions
- See complete before/after examples
- Learn testing strategies

### I want to understand the big picture
→ Read: `REFACTORING_SUMMARY.md`
- Understand what was built and why
- See impact and benefits
- Know what's next

### I need detailed rules and standards
→ Read: `/rules/mutabiq-ai-frontend-rules.md`
- Complete development rules
- All patterns and conventions
- Implementation checklists

---

## 🚀 Getting Started

### For New Features
1. Read `QUICK_REFERENCE.md` for utility imports
2. Check example migrations in the guide
3. Use new utilities from day one
4. Reference rules file for standards

### For Migrations
1. Read `REFACTORING_GUIDE.md` for your pattern
2. Follow the before/after example
3. Test using the checklist
4. Check off in migration tracking

### For Understanding
1. Read `REFACTORING_SUMMARY.md` first
2. Then dive into specific guides
3. Review example migrations
4. Ask questions if unclear

---

## 📁 Folder Structure

```
docs/
├── README.md                  # This file
├── QUICK_REFERENCE.md         # Quick lookup and snippets
├── REFACTORING_GUIDE.md       # Detailed migration instructions
└── REFACTORING_SUMMARY.md     # Overview and status

rules/
└── mutabiq-ai-frontend-rules.md  # Complete development rules

lib/
├── api/
│   └── rtkQueryBase.ts        # Shared RTK Query utilities
└── utils/
    └── validation.ts          # Validation utilities

hooks/
└── useDeleteConfirmation.tsx  # Delete confirmation hook

components/
└── custom/
    └── EntityDetailsLayout.tsx  # Detail page layout
```

---

## 🔍 Quick Links

### Utility Files
- [RTK Query Base](/lib/api/rtkQueryBase.ts)
- [Validation Utilities](/lib/utils/validation.ts)
- [Delete Confirmation Hook](/hooks/useDeleteConfirmation.tsx)
- [Entity Details Layout](/components/custom/EntityDetailsLayout.tsx)

### Example Migrations
- [API File Example](/app/lib/features/stakeholdersApi.ts)
- [Form Example](/components/app/stakeholders/create/CreateStakeholder.tsx)
- [Detail Page Example](/components/app/dataSources/details/DataSourceDetails.tsx)

### Rules
- [Complete Rules File](/rules/mutabiq-ai-frontend-rules.md)

---

## 💡 Tips

- **Use utilities from day one** - Don't reinvent the wheel
- **Check examples first** - See how it's done before asking
- **Test thoroughly** - Follow the testing checklist
- **Ask questions** - If unsure, ask before implementing

---

## 📊 Impact

By using these utilities, you'll:
- ✅ Write less code (60-80% less boilerplate)
- ✅ Have fewer bugs (consistent patterns)
- ✅ Onboard faster (clear examples)
- ✅ Maintain easier (single source of truth)

---

_Last Updated: December 9, 2025_

