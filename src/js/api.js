import db from './db.json';

export const getAllCategories = () => db.categories;

export const getCategoryByID = categoryID =>
  db.categories.find(category => category.id === categoryID);

export const getCategoryNameByID = categoryID => getCategoryByID(categoryID).name;

export const getNotesByCategoryID = categoryID =>
  db.notes.filter(note => note.categoryId === categoryID);

export const getNoteByID = noteID => db.notes.find(note => note.id === noteID);

export const deleteNoteByID = noteID => {
  db.notes = db.notes.filter(note => note.id !== noteID);
};

export const restoreNoteFromArchive = noteID => {
  db.notes = db.notes.map(note => {
    if (note.id === noteID) {
      return { ...note, archived: false };
    }
    return note;
  });
};

export const deleteAllActiveNotes = () => {
  db.notes = db.notes.filter(note => note.archived === true);
};

export const archiveNoteByID = noteID => {
  db.notes = db.notes.map(note => {
    if (note.id === noteID) {
      return { ...note, archived: true };
    }
    return note;
  });
};

export const updateNote = (id, name, categoryID, content) => {
  const note = getNoteByID(Number(id));
  const updatedNote = { ...note, name, categoryId: Number(categoryID), content };
  const filteredNotes = db.notes.filter(note => note.id !== Number(id));
  db.notes = [...filteredNotes, updatedNote].sort((a, b) => {
    if (a.id < b.id) {
      return -1;
    } else {
      return 1;
    }
  });
};

export const addNewNote = (name, categoryId, content) => {
  const allIDs = db.notes.map(note => note.id);
  const maxId = Math.max(...allIDs) + 1;
  const created = new Date().toLocaleDateString();
  const newNote = { id: maxId, created, name, categoryId, content, archived: false };
  db.notes = [...db.notes, newNote];
};

export const getAllActiveNotes = () => db.notes.filter(note => note.archived === false);
export const getAllArchivedNotes = () => db.notes.filter(note => note.archived === true);

export const getAllActiveNotesForTemplate = () => {
  const activeNotes = getAllActiveNotes();
  const dataForTemplate = activeNotes.map(({ id, name, created, categoryId, content }) => {
    const category = getCategoryByID(categoryId);
    const datesArr = content.match(/(\d{1,4}([.\-/])\d{1,2}([.\-/])\d{1,4})/g);
    const dates = datesArr ? datesArr.toString() : '';
    return {
      id,
      name,
      created,
      content,
      dates,
      categoryName: category.name,
      icon: category.icon,
    };
  });
  return dataForTemplate;
};

export const getAllArchivedNotesForTemplate = () => {
  const archivedNotes = getAllArchivedNotes();
  const dataForTemplate = archivedNotes.map(({ id, name, created, categoryId, content }) => {
    const category = getCategoryByID(categoryId);
    return {
      id,
      name,
      created,
      content,
      categoryName: category.name,
      icon: category.icon,
    };
  });
  return dataForTemplate;
};

export const getCategoriesSummary = () => {
  const summary = db.categories.map(category => {
    const notes = getNotesByCategoryID(category.id);
    const data = notes.reduce(
      (acc, note) => {
        acc.active += note.archived ? 0 : 1;
        acc.archived += note.archived ? 1 : 0;
        return acc;
      },
      { active: 0, archived: 0 },
    );
    return {
      icon: category.icon,
      name: category.name,
      active: data.active,
      archived: data.archived,
    };
  });
  return summary;
};

export const getNoteByIDAndCategories = noteID => {
  const note = getNoteByID(noteID) || {};
  const categories = getAllCategories().map(({ id, name }) => ({
    id,
    name,
    active: note.categoryId === id,
  }));
  return { note, categories };
};
