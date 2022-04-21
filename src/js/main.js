import refs from './refs';

import {
  refreshNotesTable,
  showAddNewNoteDialog,
  showArchiveDialog,
  showDeleteAllNotesDialog,
  showEditNoteDialog,
  showArchiveNoteDialog,
  showDeleteNoteMarkup,
} from './ui';

refreshNotesTable();

refs.addBtn.addEventListener('click', e => {
  showAddNewNoteDialog();
});

refs.notes.addEventListener('click', e => {
  const closest = e.target.closest('td') || e.target.closest('th');
  const btnType = closest?.dataset.type;
  const id = Number(e.target.closest('tr')?.dataset.id);

  switch (btnType) {
    case 'showArchive':
      showArchiveDialog();
      break;
    case 'deleteAll':
      showDeleteAllNotesDialog();
      break;
    case 'edit':
      showEditNoteDialog(id);
      break;
    case 'archive':
      showArchiveNoteDialog(id);
      break;
    case 'delete':
      showDeleteNoteMarkup(id);
      break;
    default:
      break;
  }
});
