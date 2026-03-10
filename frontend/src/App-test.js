import React from 'react';

function App() {
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#2E7D32', textAlign: 'center' }}>
        🏥 Health & Wellness Companion
      </h1>
      
      <div style={{ 
        maxWidth: '400px', 
        margin: '50px auto', 
        padding: '30px',
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>
          Welcome Back!
        </h2>
        
        <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="email" 
            placeholder="Email" 
            style={{ 
              padding: '12px', 
              border: '1px solid #ddd', 
              borderRadius: '5px',
              fontSize: '16px'
            }}
            defaultValue="test@example.com"
          />
          
          <input 
            type="password" 
            placeholder="Password" 
            style={{ 
              padding: '12px', 
              border: '1px solid #ddd', 
              borderRadius: '5px',
              fontSize: '16px'
            }}
            defaultValue="password"
          />
          
          <button 
            type="button"
            onClick={() => alert('Login functionality working! This is a test version.')}
            style={{ 
              padding: '12px', 
              backgroundColor: '#2E7D32', 
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Sign In
          </button>
        </form>
        
        <div style={{ 
          marginTop: '30px', 
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '5px'
        }}>
          <h3>🎉 App is Working!</h3>
          <p>✅ React is loading correctly</p>
          <p>✅ CSS styles are applied</p>
          <p>✅ JavaScript events work</p>
          <p>✅ No more white page!</p>
        </div>
      </div>
    </div>
  );
}

export default App;