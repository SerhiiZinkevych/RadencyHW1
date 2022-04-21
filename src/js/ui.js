import refs from './refs';
import notesTemplate from '../template/notes.hbs';
import archivedNotesTemplate from '../template/archivedNotes.hbs';
import categoriesTemplate from '../template/categories.hbs';
import editForm from '../template/editForm.hbs';
import popupForm from '../template/popupForm.hbs';
import messageTemplate from '../template/message.hbs';
import deleteAllTemplate from '../template/deleteAll.hbs';
import {
  getAllActiveNotesForTemplate,
  getCategoriesSummary,
  getNoteByIDAndCategories,
  getNoteByID,
  deleteNoteByID,
  getAllActiveNotes,
  archiveNoteByID,
  updateNote,
  addNewNote,
  getAllArchivedNotesForTemplate,
  restoreNoteFromArchive,
  deleteAllActiveNotes,
} from './api';
import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/dist/basicLightbox.min.css';

export function refreshNotesTable() {
  const activeNotes = getAllActiveNotesForTemplate();
  const notesMarkup = notesTemplate(activeNotes);
  const categoriesSummary = getCategoriesSummary();
  const categoriesMarkup = categoriesTemplate(categoriesSummary);
  refs.categories.innerHTML = categoriesMarkup;
  refs.notes.innerHTML = notesMarkup;
}

export function refreshArchivedNotesTable() {
  const archivedNotes = getAllArchivedNotesForTemplate();
  const notesMarkup = archivedNotesTemplate(archivedNotes);
  basicLightbox.create(notesMarkup).show();
  const archivedNotesTable = document.querySelector('.archivedNotes');
  archivedNotesTable.addEventListener('click', e => {
    const isRestoreClicked = !!e.target.closest('td')?.dataset.type;
    if (isRestoreClicked) {
      const id = Number(e.target.closest('tr')?.dataset.id);
      restoreNoteFromArchive(id);
      refreshNotesTable();
      const archivedNotes = getAllArchivedNotesForTemplate();
      const notesMarkup = archivedNotesTemplate(archivedNotes);
      archivedNotesTable.innerHTML = notesMarkup;
      if (archivedNotes.length === 0) {
        document.querySelector('.basicLightbox').outerHTML = '';
      }
    }
  });
}

export function showAddNewNoteDialog() {
  const note = getNoteByIDAndCategories();

  basicLightbox
    .create(editForm(note), {
      onShow: instance => {
        instance.element().querySelector('input[type="submit"]').onclick = instance.close;
      },
    })
    .show();

  document.querySelector('input[type="submit"]').addEventListener('click', e => {
    const name = e.target.form.name.value;
    const category = e.target.form.category.value;
    const content = e.target.form.content.value;

    e.preventDefault();
    addNewNote(name, Number(category), content);
    refreshNotesTable();
  });
}

export function showArchiveDialog() {
  const archivedNotes = getAllArchivedNotesForTemplate();
  if (archivedNotes.length > 0) {
    refreshArchivedNotesTable();
  } else {
    basicLightbox.create(messageTemplate({ message: "There's no archived notes." })).show();
  }
}

export function showDeleteAllNotesDialog() {
  basicLightbox
    .create(deleteAllTemplate(), {
      onShow: instance => {
        instance.element().querySelector('input[type="button"]').onclick = instance.close;
        instance.element().querySelector('input[type="submit"]').onclick = instance.close;
      },
    })
    .show();

  document.querySelector('input[type="submit"]').addEventListener('click', e => {
    e.preventDefault();
    deleteAllActiveNotes();
    refreshNotesTable();
  });
}

export function showEditNoteDialog(id) {
  const note = getNoteByIDAndCategories(Number(id));
  basicLightbox
    .create(editForm(note), {
      onShow: instance => {
        instance.element().querySelector('input[type="submit"]').onclick = instance.close;
      },
    })
    .show();

  document.querySelector('input[type="submit"]').addEventListener('click', e => {
    const id = e.target.form.id.value;
    const name = e.target.form.name.value;
    const category = e.target.form.category.value;
    const content = e.target.form.content.value;

    e.preventDefault();
    updateNote(id, name, category, content);
    console.log(id, name, category, content);
    console.log(...getAllActiveNotes());
    refreshNotesTable();
  });
}

export function showArchiveNoteDialog(id) {
  const markup = popupForm({ action: 'archive', name: getNoteByID(id)?.name });

  basicLightbox
    .create(markup, {
      onShow: instance => {
        instance.element().querySelector('input[type="button"]').onclick = instance.close;
        instance.element().querySelector('input[type="submit"]').onclick = instance.close;
      },
    })
    .show();

  document.querySelector('input[data-action="archive"]').addEventListener('click', e => {
    e.preventDefault();
    archiveNoteByID(id);
    refreshNotesTable();
  });
}

export function showDeleteNoteMarkup(id) {
  const markup = popupForm({ action: 'delete', name: getNoteByID(id)?.name });

  basicLightbox
    .create(markup, {
      onShow: instance => {
        instance.element().querySelector('input[type="button"]').onclick = instance.close;
        instance.element().querySelector('input[type="submit"]').onclick = instance.close;
      },
    })
    .show();

  document.querySelector('input[data-action="delete"]').addEventListener('click', e => {
    e.preventDefault();
    deleteNoteByID(id);
    refreshNotesTable();
  });
}
