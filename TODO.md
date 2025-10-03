# Catalogue Page Fixes

## Issues Identified
- [ ] Missing course images (referenced paths don't exist)
- [ ] Hardcoded course data instead of API integration
- [ ] Inline course cards instead of using ProductCard component
- [ ] No add-to-cart functionality
- [ ] No course details navigation
- [ ] Search functionality may not work optimally
- [ ] Missing loading and error states
- [ ] No proper responsive design for course grid

## Tasks
- [x] Create cart context and hook
- [x] Add CartProvider to App.tsx
- [x] Update CartPage to use cart context
- [ ] Replace missing images with existing assets or placeholders
- [ ] Refactor to use ProductCard component from course-card.tsx
- [ ] Add add-to-cart functionality with cart context/state
- [ ] Make courses clickable for navigation to course details
- [ ] Improve search and filtering logic
- [ ] Add loading states for data fetching
- [ ] Add error handling for failed operations
- [ ] Ensure proper responsive grid layout
- [ ] Add proper TypeScript types for course data
- [ ] Test all functionality works correctly
