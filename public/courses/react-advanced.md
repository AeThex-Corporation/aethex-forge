# Advanced React & State Management
**Complete Course Guide | 20 Hours | Advanced Level**

---

## Table of Contents
1. [Chapter 1: React Fundamentals Review](#chapter-1)
2. [Chapter 2: Hooks Deep Dive](#chapter-2)
3. [Chapter 3: Custom Hooks](#chapter-3)
4. [Chapter 4: Context API & Global State](#chapter-4)
5. [Chapter 5: Redux Mastery](#chapter-5)
6. [Chapter 6: Performance Optimization](#chapter-6)
7. [Chapter 7: Advanced Patterns](#chapter-7)
8. [Chapter 8: Testing React](#chapter-8)
9. [Chapter 9: TypeScript with React](#chapter-9)
10. [Chapter 10: Real-World Application](#chapter-10)

---

## Chapter 1: React Fundamentals Review {#chapter-1}

### Components
React applications are built from components.

#### Function Components
```jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

// With destructuring
function Welcome({ name, email }) {
  return (
    <div>
      <h1>Hello, {name}</h1>
      <p>Email: {email}</p>
    </div>
  );
}
```

#### Class Components
```jsx
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

Function components are preferred in modern React (use Hooks instead of class lifecycle).

### JSX
JSX looks like HTML but is JavaScript:

```jsx
// JSX
const element = <h1>Hello, World!</h1>;

// Compiles to:
const element = React.createElement('h1', null, 'Hello, World!');
```

### Props vs State

#### Props
- Read-only data passed from parent to child
- Cannot be modified by the child
- Use for passing configuration

```jsx
<User name="John" age={30} />
```

#### State
- Mutable data owned by a component
- Can be updated with setState (or setState Hook)
- Causes re-render when changed

### Virtual DOM
React's efficiency secret:
1. Update Virtual DOM (fast, in-memory)
2. Diff with previous Virtual DOM
3. Update actual DOM (slow operation) only where needed
4. Re-render component

---

## Chapter 2: Hooks Deep Dive {#chapter-2}

### useState
Manage component state:

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
```

Multiple state values:
```jsx
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [age, setAge] = useState(null);
```

State batching (React 18+):
```jsx
function handleClick() {
  // Both updates are batched
  setCount(c => c + 1);
  setFlagStatus(f => !f);
  // Only one re-render!
}
```

### useEffect
Handle side effects:

```jsx
useEffect(() => {
  // This runs after every render
  console.log('Component rendered');
});

useEffect(() => {
  // This runs once on mount
  console.log('Component mounted');
}, []);  // Empty dependency array

useEffect(() => {
  // This runs when deps change
  console.log('Dependencies changed');
}, [dependency1, dependency2]);
```

Cleanup function:
```jsx
useEffect(() => {
  const subscription = data.subscribe();
  
  return () => {
    // Cleanup on unmount
    subscription.unsubscribe();
  };
}, []);
```

### useReducer
Complex state management:

```jsx
const initialState = { count: 0 };

function reducer(state, action) {
  switch(action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>
        +
      </button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>
        -
      </button>
      <button onClick={() => dispatch({ type: 'RESET' })}>
        Reset
      </button>
    </div>
  );
}
```

### useContext
Access context without nesting:

```jsx
// Create context
const ThemeContext = React.createContext('light');

// Provide
<ThemeContext.Provider value="dark">
  <MyComponent />
</ThemeContext.Provider>

// Consume
function MyComponent() {
  const theme = useContext(ThemeContext);
  return <div style={{ background: theme }}>Content</div>;
}
```

### Other Important Hooks

#### useCallback
Memoize function references:
```jsx
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

#### useMemo
Memoize expensive computations:
```jsx
const memoizedValue = useMemo(() => {
  return expensiveComputation(a, b);
}, [a, b]);
```

#### useRef
Access DOM directly:
```jsx
function TextInput() {
  const inputRef = useRef(null);
  
  const focusInput = () => {
    inputRef.current.focus();
  };
  
  return (
    <>
      <input ref={inputRef} />
      <button onClick={focusInput}>Focus</button>
    </>
  );
}
```

---

## Chapter 3: Custom Hooks {#chapter-3}

### Creating Custom Hooks
Extract component logic into reusable hooks:

```jsx
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}

// Usage
function MyComponent() {
  const [name, setName] = useLocalStorage('name', '');
  
  return (
    <input 
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
  );
}
```

### useAsync
Handle async operations:

```jsx
function useAsync(asyncFunction, immediate = true) {
  const [status, setStatus] = useState('idle');
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);

  const execute = useCallback(async () => {
    setStatus('pending');
    setValue(null);
    setError(null);
    try {
      const response = await asyncFunction();
      setValue(response);
      setStatus('success');
      return response;
    } catch (error) {
      setError(error);
      setStatus('error');
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, status, value, error };
}

// Usage
function FetchUser({ userId }) {
  const { status, value, error } = useAsync(
    () => fetch(`/api/user/${userId}`).then(r => r.json())
  );

  if (status === 'pending') return <div>Loading...</div>;
  if (status === 'error') return <div>Error: {error.message}</div>;
  if (status === 'success') return <div>{value.name}</div>;
}
```

### useFetch
Dedicated hook for fetching data:

```jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) {
          setData(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  return { data, loading, error };
}
```

---

## Chapter 4: Context API & Global State {#chapter-4}

### When to Use Context
- Theme data (light/dark mode)
- User authentication state
- UI preferences
- Language/localization

### Context Provider Pattern

```jsx
// Create context
const AppContext = createContext();

// Create provider component
function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const value = {
    user,
    setUser,
    notifications,
    setNotifications,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook for using context
function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

// Usage
<AppProvider>
  <MyApp />
</AppProvider>

function MyComponent() {
  const { user, setUser } = useApp();
  // ...
}
```

### Multiple Contexts
Combine multiple contexts:

```jsx
function Root({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
```

### Context Optimization
Context causes re-render of all consumers. Optimize by:

```jsx
// Split into smaller contexts
const UserContext = createContext();
const UIContext = createContext();

// Memoize provider value
const value = useMemo(() => ({
  user,
  setUser
}), [user]);

return (
  <UserContext.Provider value={value}>
    {children}
  </UserContext.Provider>
);
```

---

## Chapter 5: Redux Mastery {#chapter-5}

### Redux Concepts

#### Store
Single source of truth containing all application state:
```js
const store = createStore(reducer, initialState);
```

#### Actions
Plain objects describing what happened:
```js
const action = {
  type: 'USER_LOGGED_IN',
  payload: { userId: 123, name: 'John' }
};
```

#### Reducers
Pure functions that return new state:
```js
function userReducer(state = null, action) {
  switch(action.type) {
    case 'USER_LOGGED_IN':
      return action.payload;
    case 'USER_LOGGED_OUT':
      return null;
    default:
      return state;
  }
}
```

### Redux with React

```jsx
import { useSelector, useDispatch } from 'react-redux';

function MyComponent() {
  // Subscribe to state
  const user = useSelector(state => state.user);
  
  // Dispatch actions
  const dispatch = useDispatch();
  
  return (
    <div>
      <p>User: {user?.name}</p>
      <button onClick={() => dispatch({ type: 'USER_LOGGED_OUT' })}>
        Logout
      </button>
    </div>
  );
}
```

### Redux Toolkit (Modern Redux)

```jsx
import { createSlice, configureStore } from '@reduxjs/toolkit';

// Create slice (reducer + actions)
const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    loginUser: (state, action) => action.payload,
    logoutUser: () => null,
  },
});

// Create store
const store = configureStore({
  reducer: {
    user: userSlice.reducer,
  },
});

// Export actions
export const { loginUser, logoutUser } = userSlice.actions;

// Usage
function MyComponent() {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  
  return (
    <button onClick={() => dispatch(logoutUser())}>
      Logout
    </button>
  );
}
```

---

## Chapter 6: Performance Optimization {#chapter-6}

### React.memo
Prevent unnecessary re-renders:

```jsx
const MyComponent = React.memo(function MyComponent(props) {
  return <div>{props.value}</div>;
});

// Only re-renders if props change
```

### useMemo
Memoize expensive computations:

```jsx
function ExpensiveComponent({ items }) {
  const sortedItems = useMemo(() => {
    console.log('Sorting...');
    return items.sort((a, b) => a.value - b.value);
  }, [items]);

  return <div>{sortedItems.length} items</div>;
}
```

### useCallback
Prevent child re-renders:

```jsx
function Parent() {
  const [count, setCount] = useState(0);
  
  // Without useCallback, Child re-renders every time
  const handleClick = useCallback(() => {
    setCount(c => c + 1);
  }, []);

  return <Child onClick={handleClick} />;
}

const Child = React.memo(({ onClick }) => (
  <button onClick={onClick}>Click me</button>
));
```

### Code Splitting
Load code on demand:

```jsx
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### Profiling
Measure performance:

```jsx
import { Profiler } from 'react';

function onRenderCallback(id, phase, actualDuration) {
  console.log(`${id} (${phase}) took ${actualDuration}ms`);
}

<Profiler id="MyComponent" onRender={onRenderCallback}>
  <MyComponent />
</Profiler>
```

---

## Chapter 7: Advanced Patterns {#chapter-7}

### Render Props Pattern
```jsx
function DataProvider({ children }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData().then(setData);
  }, []);

  return children({ data });
}

// Usage
<DataProvider>
  {({ data }) => <div>{data?.title}</div>}
</DataProvider>
```

### Higher-Order Components (HOC)
```jsx
function withAuth(Component) {
  return function ProtectedComponent(props) {
    const { user } = useContext(AuthContext);
    
    if (!user) return <Navigate to="/login" />;
    return <Component {...props} />;
  };
}

const ProtectedPage = withAuth(MyPage);
```

### Compound Components
```jsx
function Form({ children }) {
  const [values, setValues] = useState({});
  return <FormContext.Provider value={values}>{children}</FormContext.Provider>;
}

Form.Input = function FormInput({ name }) {
  const values = useContext(FormContext);
  return <input value={values[name]} />;
};

// Usage
<Form>
  <Form.Input name="email" />
  <Form.Input name="password" />
</Form>
```

---

## Chapter 8: Testing React {#chapter-8}

### Unit Testing with Jest
```jsx
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

test('renders welcome message', () => {
  render(<MyComponent />);
  expect(screen.getByText('Welcome')).toBeInTheDocument();
});

test('button click handler called', () => {
  const handleClick = jest.fn();
  render(<button onClick={handleClick}>Click</button>);
  screen.getByRole('button').click();
  expect(handleClick).toHaveBeenCalled();
});
```

### Integration Testing
```jsx
test('user login flow', async () => {
  render(<LoginForm />);
  
  const emailInput = screen.getByLabelText('Email');
  const passwordInput = screen.getByLabelText('Password');
  const submitButton = screen.getByText('Login');
  
  userEvent.type(emailInput, 'test@example.com');
  userEvent.type(passwordInput, 'password');
  userEvent.click(submitButton);
  
  await waitFor(() => {
    expect(screen.getByText('Welcome')).toBeInTheDocument();
  });
});
```

---

## Chapter 9: TypeScript with React {#chapter-9}

### Basic Types
```tsx
interface User {
  id: number;
  name: string;
  email: string;
}

interface Props {
  user: User;
  onUpdate: (user: User) => void;
}

function UserCard({ user, onUpdate }: Props) {
  return <div>{user.name}</div>;
}
```

### Component Types
```tsx
// Function component
type MyComponentProps = {
  title: string;
  count?: number;
};

const MyComponent: React.FC<MyComponentProps> = ({ title, count = 0 }) => {
  return <div>{title}: {count}</div>;
};

// With children
interface Props {
  children: React.ReactNode;
}

function Container({ children }: Props) {
  return <div>{children}</div>;
}
```

---

## Chapter 10: Real-World Application {#chapter-10}

Build a complete todo application with:
- Multiple components
- State management
- API integration
- Local storage
- Error handling
- Loading states

This ties everything together into a production-ready application.

---

## Summary & Resources

You've learned advanced React patterns and optimization techniques. Key takeaways:

1. **Hooks**: useState, useEffect, useContext, useReducer
2. **State Management**: Context API, Redux
3. **Performance**: Memoization, code splitting, profiling
4. **Testing**: Jest, React Testing Library
5. **TypeScript**: Type safety for React applications

### Next Steps
- Build production applications
- Contribute to open source
- Learn Next.js for full-stack development
- Explore React Native for mobile

Happy coding! ⚛️
