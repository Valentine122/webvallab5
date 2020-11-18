const openAddCombineButton = document.getElementById('add_combine_open_button');
const add_combine_section = document.getElementById('add_combine');
const close_cross = document.getElementById('cross');

openAddCombineButton.addEventListener('click', () => {
    add_combine_section.classList.add('show');
})

close_cross.addEventListener('click', () => {
    add_combine_section.classList.remove('show');
})