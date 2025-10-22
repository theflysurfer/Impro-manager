# Playwright E2E Tests

Comprehensive end-to-end tests for Impro Manager v2.0.

## Test Files

### 1. `mc-workflow.spec.js`
Tests for MC (Master of Ceremonies) persona workflows:
- ✅ Create match using templates
- ✅ Add/edit lines with LineEditor
- ✅ Edit team names and scores
- ✅ Navigate to Live Mode
- ✅ Timer controls (start/pause/stop/reset)

**Coverage**: Match creation, template loading, line management, navigation

### 2. `sound-workflow.spec.js`
Tests for Sound Engineer persona workflows:
- ✅ View music library
- ✅ Filter music by type (musiques vs bruitages)
- ✅ Search music
- ✅ Play music tracks
- ✅ Assign 3-point music to lines
- ✅ Audio player controls (play/pause/stop)
- ✅ Volume control
- ✅ Quick launch buttons
- ✅ Navigate to Live Mode

**Coverage**: Music library, playback, assignment, navigation

### 3. `live-mode-sync.spec.js`
Tests for Live Mode real-time synchronization:
- ✅ Live Mode page accessibility
- ✅ WebSocket connection establishment
- ✅ MC Live interface loading
- ✅ Sound Live interface loading
- ✅ Error handling (invalid match, network errors)
- ✅ State persistence (state_sync events)
- ⏸️ **Skipped**: Real-time sync between MC and Sound (requires multi-browser setup)

**Coverage**: Live Mode access, WebSocket, error handling

### 4. `music-library.spec.js`
Existing test file for music library functionality.

---

## Running Tests

### Prerequisites

1. **Install Playwright**:
   ```bash
   npm install
   npx playwright install
   ```

2. **Start Backend Server**:
   ```bash
   cd backend && npm start
   # Server should run on http://localhost:3001
   ```

3. **Start Frontend Dev Server**:
   ```bash
   cd client && npm run dev
   # Vite should run on http://localhost:5173
   ```

### Run All Tests

```bash
# Run all tests in headless mode
npx playwright test

# Run with UI
npx playwright test --ui

# Run specific test file
npx playwright test mc-workflow

# Run in headed mode (see browser)
npx playwright test --headed

# Run with debugging
npx playwright test --debug
```

### Run Specific Test Suites

```bash
# MC workflow only
npx playwright test mc-workflow.spec.js

# Sound workflow only
npx playwright test sound-workflow.spec.js

# Live Mode only
npx playwright test live-mode-sync.spec.js

# Run specific test by name
npx playwright test --grep "MC can create a match"
```

### View Test Report

```bash
# Generate and open HTML report
npx playwright show-report
```

---

## Test Strategy

### What is Tested

✅ **User Workflows**:
- Match creation and configuration
- Template loading
- Line creation/editing with all 8 types
- Music assignment (3-point system)
- Audio playback controls
- Live Mode navigation

✅ **Core Features**:
- Music library filtering and search
- Team management
- Timer functionality
- WebSocket connectivity
- Error handling

✅ **UI Interactions**:
- Modal dialogs
- Form inputs
- Dropdowns and selectors
- Button clicks
- Navigation

### What is NOT Tested

❌ **Real-Time Synchronization**:
- Multi-browser tests (MC + Sound simultaneously) are complex
- Currently marked as `test.skip`
- Requires special setup with multiple browser contexts

❌ **Audio Playback**:
- Actual audio file streaming
- Audio analysis
- Cue point accuracy

❌ **Backend Unit Tests**:
- These are E2E tests only
- Backend logic should have separate unit tests

---

## Test Data Requirements

### Existing Data Expected

Tests assume the following data exists:

1. **Music Library**:
   - `music_library.json` should have tracks
   - At least some tracks should be classified as "music" vs "sound_effect"

2. **Match Data**:
   - `data/matches.json` may have existing matches
   - Tests create new matches as needed

3. **Templates**:
   - `data/templates.json` should have 4 templates:
     - `standard_19`
     - `court_12`
     - `training`
     - `demo`

### Test Match Creation

Most tests create their own test matches with predictable names:
- "Test Match - Standard"
- "Test Match - Line Editor"
- "Test Match - Teams"
- "Test Match - Live Mode"
- "Test Match - Timer"

**Cleanup**: Tests do NOT automatically clean up created matches.

---

## Known Issues & Limitations

### 1. Test Flakiness
- **Timeouts**: Tests use `waitForTimeout()` which can be flaky
- **Better approach**: Use Playwright's built-in `waitFor` methods

### 2. Data Dependency
- Tests assume backend is populated with music library
- Empty music library will cause some tests to fail

### 3. Selector Fragility
- Tests use text-based selectors (e.g., `getByRole`, `hasText`)
- Changes to UI text will break tests
- **Better approach**: Use `data-testid` attributes

### 4. Multi-Browser Sync
- Real-time sync test is skipped
- Requires complex setup with Socket.IO mocking or two contexts

### 5. State Pollution
- Tests create matches but don't clean up
- Running tests multiple times will accumulate test data
- **Workaround**: Manual cleanup or test isolation

---

## Continuous Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Start backend
        run: |
          cd backend && npm install && npm start &
          sleep 5

      - name: Start frontend
        run: |
          cd client && npm install && npm run build
          npx serve -s dist -l 5173 &
          sleep 5

      - name: Run tests
        run: npx playwright test

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

---

## Future Improvements

1. **Add `data-testid` attributes** to critical UI elements
2. **Implement test fixtures** for consistent test data
3. **Add cleanup hooks** to remove test matches after each test
4. **Implement multi-browser sync tests** using Playwright contexts
5. **Add API tests** for backend endpoints
6. **Add performance tests** (page load times, WebSocket latency)
7. **Add accessibility tests** using `axe-core`
8. **Add visual regression tests** using Playwright screenshots

---

## Contributing

When adding new features, please:

1. Add corresponding E2E tests
2. Use `data-testid` for testable elements
3. Follow existing test patterns
4. Document any new test data requirements
5. Run tests locally before committing

---

**Last Updated**: 2025-10-22
**Test Coverage**: ~75% of core user workflows
