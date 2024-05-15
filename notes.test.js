const { ProductLauncher } = require("puppeteer");

describe('Basic user for notes app', () => {
  // First, visit the notes website
  beforeAll(async () => {
    await page.goto('https://elaine-ch.github.io/CSE110-SP24-Lab6-Template/');
  });

  // Check that there are no notes when initially opened
  it('No notes when opened first time', async() => {
    console.log('Check that there are no notes when initiallly opened');
    const numNotes = await page.$$eval('text-area', notesAdded => {
        return notesAdded.length;
    });
    expect(numNotes).toBe(0);
  });

  // Next create some notes
  it('Check that adding notes creates more elements', async() => {
    console.log('Check that when you click add notes times then 1 note elements exists');
    const addNote = await page.$('button');
    await addNote.click();
    const numNotes = await page.$$eval('textarea', (notesAdded) => {
        return notesAdded.length;
    });
    expect(numNotes).toBe(1);
  });

  // Check that we can add multiple notes
  it('Can add multiple notes', async() => {
    console.log('Check that when you click add notes 3 more times then 4 note elements exists');
    const addNote = await page.$('button');
    await addNote.click();
    await addNote.click();
    await addNote.click();
    const numNotes = await page.$$eval('textarea', (notesAdded) => {
        return notesAdded.length;
    });
    expect(numNotes).toBe(4);
  });

  // Check that double clicking deletes a note
  it('Can delete a note', async() => {
    console.log('When double clicking a note then it will be deleted');
    const notes = await page.$$('textarea');
    await notes[0].click({clickCount: 2});
    const numNotes = await page.$$eval('textarea', (notesAdded) => {
        return notesAdded.length;
    });
    expect(numNotes).toBe(3);
  });

  it('Can edit a note', async() => {
    console.log('When clicking on a note and editing, the changes are saved');
    const note = await page.$('textarea');
    await note.click();
    await note.type('This is a test note.');
    const noteContent = await page.$eval('textarea', el => el.value);
    expect(noteContent).toBe('This is a test note.');
  });

  // Check that if you click again on a focused note then it can't be deleted
  it('Cannot delete a focused note by clicking again', async() => {
    console.log('When clicking again on a focused note, it should not be deleted');
    const notes = await page.$$('textarea');
    await notes[0].click();
    await notes[0].click();
    const numNotes = await page.$$eval('textarea', (notesAdded) => {
      return notesAdded.length;
    });
    expect(numNotes).toBe(3);
  });

  // Check that if you tab out then the note is saved in local memory
  it('Note is saved in local memory when tabbing out', async() => {
    console.log('When tabbing out, the note is saved in local memory');
    const notes = await page.$$('textarea');
    const note = notes[1];
    await note.click();
    await note.type('This note should be saved.');
    await page.keyboard.press('Tab');
    const noteContent = await page.$$eval('textarea', notesAdded => notesAdded[1].value);
    await page.reload();
    expect(noteContent).toBe('This note should be saved.');
  });

  // Check that if you click out then the note is saved in memory
  it('Note is saved in memory when clicking out', async() => {
    console.log('When clicking out, the note is saved in memory');
    const notes = await page.$$('textarea');
    const note = notes[2];
    const noteClickedTo = notes[1];
    await note.click();
    await note.type('This note should be saved on click out.');
    await noteClickedTo.click();
    await page.reload();
    const noteContent = await page.$$eval('textarea', notesAdded => notesAdded[2].value);
    expect(noteContent).toBe('This note should be saved on click out.');
  });

  // Check that the number of notes are the same after refreshing
  it('Number of notes remain the same after refreshing', async() => {
    console.log('The number of notes should remain the same after refreshing the page');
    await page.reload();
    const numNotes = await page.$$eval('textarea', (notesAdded) => {
      return notesAdded.length;
    });
    expect(numNotes).toBe(3);
  });

  // Check that the content of the notes are the same after refreshing
  it('Content of notes remain the same after refreshing', async() => {
    console.log('The content of the notes should remain the same after refreshing the page');
    const noteContents = await page.$$eval('textarea', notes => notes.map(note => note.value));
    await page.reload();
    const refreshedNoteContents = await page.$$eval('textarea', notes => notes.map(note => note.value));
    expect(refreshedNoteContents).toEqual(noteContents);
  });

  // Try refreshing the page while on a focused note, shouldn't save
  it('Note changes are not saved if page is refreshed while editing', async() => {
    console.log('Note changes should not be saved if the page is refreshed while editing');
    const note = await page.$('textarea');
    await note.click();
    await note.type('This text will not be saved.');
    await page.reload();
    const noteContent = await page.$eval('textarea', el => el.value);
    expect(noteContent).not.toBe('This text will not be saved.');
  });
});