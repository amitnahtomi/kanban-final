# Cyber4s 3rd Pre-Course Final Project

   amitnahtomi's kanban board:
   ## page elements 
   - 3 `section` elements for 3 kind of tasks (todo, in-progress, done).
   - each section contains a `ul` list for the tasks and an `input` and add `button` to add new tasks.
   - there is a `h1` header for the page and `h2` header for each `section`.
   - below the page header there is an `input` that allows you to search specific tasks by text.
   - a load and save: the save `button` allows the use to save the current tasks template and the load `button` gives the page the last template the user saved.
   
   ## page events
   - onclick each add `button` adds a new `li` task to the `section`.
   - double clicking a task allows the user to edit its text.
   - hovering a task and pressing alt + 1/2/3 moves the to the requested `section` (1: todo, 2: in-prodress, 3: done). moving the task to the done `section` gives the user a "well done" indication.
   - the user can search specific tasks using the search `input`. the sections update at each keyboard press.
