# Clause Definitions Manager – Requirements

## Task
Build a small **React + TypeScript** app to manage and preview Clause Definitions.  

A **Clause Definition** has:  
- `title`  
- `description`  
- `version`  
- `chainId`  
- `state`  
- `updatedAt`  
- `templateBody`  
- `fields[]` (questions)  

---

## Basic Features
- Show a list of Clause Definitions in a table with columns:  
  `Id`, `Title`, `Version`, `ChainId`, `State`, `UpdatedAt`.  
- Add:  
  - Search by Title  
  - Filter by State and ChainId  
  - Sorting  
  - Pagination  
- Form to **create/edit Clause Definitions** with validation.  
- **Fields[]**:  
  - `id`  
  - `clauseId`  
  - `order`  
  - `key` (unique)  
  - `label`  
  - `type`  
  - `isRequired`  
- Follow the UI design. You may edit or add as needed but keep the identity.  

---

## Additional Features
- Use **React Context** for global UI state (filters, pagination, modals).  
- Simulate async calls with promises + delays.  
- Add **loading, empty, and error states**.  
- Show **success/error toasts** for actions.  
- Persist filters in **URL query string**.  
- Use **react-hook-form** with schema validation. 