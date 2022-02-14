import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { addBug, assignBug, getUnresolvedBugs, loadBugs, resolveBug } from '../bugs';
import configureStore from '../configureStore';

describe('bugSlice', () => {
  let fakeAxios;
  let store;

  beforeEach(() => {
    fakeAxios = new MockAdapter(axios);
    store = configureStore();
  });

  const bugsSlice = () => store.getState().entities.bugs;

  it('should add the bug to the store if saved to the server', async () => {
    const bug = { description: 'a' };
    const savedBug = { ...bug, id: 1 };

    fakeAxios.onPost('/bugs').reply(200, savedBug);

    await store.dispatch(addBug(bug));

    expect(bugsSlice().list).toContainEqual(savedBug);
  });

  it('should not add the bug to the store if not saved to the server', async () => {
    const bug = { description: 'a' };

    fakeAxios.onPost('/bugs').reply(500);

    await store.dispatch(addBug(bug));

    expect(bugsSlice().list).toHaveLength(0);
  });

  describe('loading bugs', () => {
    describe('if the bugs exist in the cache', () => {
      it('they should not be fetched from the serfver again', async () => {
        fakeAxios.onGet('/bugs').reply(200, [{ id: 1 }]);

        await store.dispatch(loadBugs());
        await store.dispatch(loadBugs());

        expect(fakeAxios.history.get).toHaveLength(1);
      });
    });

    describe('if the bugs don not exist in the cache', () => {
      it('should be fetched from the server and put in the store', async () => {
        fakeAxios.onGet('/bugs').reply(200, [{ id: 1 }]);

        await store.dispatch(loadBugs());

        expect(bugsSlice().list).toHaveLength(1);
        expect(fakeAxios.history.get).toHaveLength(1);
      });

      describe('loading indicator', () => {
        it('should be true while fetching the bugs', () => {
          fakeAxios.onGet('/bugs').reply(() => {
            expect(bugsSlice().loading).toBe(true);
            return [200, [{ id: 1 }]];
          });

          store.dispatch(loadBugs());
        });

        it('should be false after bugs are fetched', async () => {
          fakeAxios.onGet('/bugs').reply(200, [{ id: 1 }]);

          await store.dispatch(loadBugs());

          expect(bugsSlice().loading).toBe(false);
        });

        it('should be false after error', async () => {
          fakeAxios.onGet('/bugs').reply(500);

          await store.dispatch(loadBugs());

          expect(bugsSlice().loading).toBe(false);
        });
      });
    });
  });

  it('should assign bug in store when assignment is saved', async () => {
    fakeAxios.onPost('/bugs').reply(200, { id: 10 });
    fakeAxios.onPatch('/bugs/10').reply(200, { id: 10, userId: 666 });

    await store.dispatch(addBug({}));
    await store.dispatch(assignBug(10, 666));
    expect(bugsSlice().list).toEqual([{ id: 10, userId: 666 }]);
  });

  it('should not assign bug in store when assignment is not saved', async () => {
    fakeAxios.onPost('/bugs').reply(200, { id: 10 });
    fakeAxios.onPatch('/bugs/10').reply(500);

    await store.dispatch(addBug({}));
    await store.dispatch(assignBug(10, 666));
    expect(bugsSlice().list).toEqual([{ id: 10 }]);
  });

  it('should resolve bug in store when resolve is saved', async () => {
    const savedBug = {
      id: 10,
      resolved: true,
    };

    fakeAxios.onPost('/bugs').reply(200, { id: 10 });
    fakeAxios.onPatch('/bugs/10').reply(200, savedBug);

    await store.dispatch(addBug({}));
    await store.dispatch(resolveBug(10, true));

    expect(bugsSlice().list[0].resolved).toBe(true);
  });

  it('should not resolve a bug in the store when resolve does not save', async () => {
    fakeAxios.onPost('/bugs').reply(200, { id: 10 });
    fakeAxios.onPatch('/bugs/10').reply(400);

    await store.dispatch(addBug({}));
    await store.dispatch(resolveBug(10, true));

    expect(bugsSlice().list[0].resolved).toBeUndefined();
  });

  describe('selectors', () => {
    const createState = () => ({
      entities: {
        bugs: {
          list: [],
        },
      },
    });

    const getBugs = (state) => state.entities.bugs;

    let state;

    beforeEach(() => {
      state = createState();
    });

    it('should find unresolved bugs when they exist', () => {
      getBugs(state).list = [
        { id: 1, description: 'a', resolved: true },
        { id: 2, description: 'b', resolved: false },
      ];

      const result = getUnresolvedBugs(state);

      expect(result).toEqual([{ id: 2, description: 'b', resolved: false }]);
    });

    it('should not find unresolved bugs when none exist', () => {
      getBugs(state).list = [
        { id: 1, description: 'a', resolved: true },
        { id: 2, description: 'b', resolved: true },
      ];

      const result = getUnresolvedBugs(state);

      expect(result).toHaveLength(0);
    });
  });
});
