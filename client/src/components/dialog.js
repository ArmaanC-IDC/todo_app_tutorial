import React, { useState, useRef } from 'react';

export const Dialog = ({todo, onSubmit, params, setShow, title}) => {

    const formRef = useRef(null);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          width: '80vw',
          height: '80vh',
          borderRadius: '8px',
          boxShadow: '0 2px 16px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          padding: '1rem',
        }}
      >
        {/* HEADER */}
        <div style={{flex: 1, display: 'flex', justifyContent: 'center'}}>
            <h1>{title}</h1>
        </div>

        {/* MAIN FORM DATA */}
        <div style={{
            flex: 8, 
            overflowY: 'auto', 
            display: 'flex', 
            justifyContent: 'center',
        }}>
            <form ref={formRef} style={{width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column', }}>
                {params.map((input) => {
                    const { name, label, type, style, ...inputProps } = input;
                    return (<div key={name}>
                        <label
                        htmlFor={input.name}
                        style={{
                            fontWeight: 600,
                            marginBottom: '0.3rem',
                            color: '#333',
                            fontFamily: 'Arial, sans-serif',
                            fontSize: '1rem',
                            display: 'block'
                        }}
                        >
                            {input.label}
                        </label>
                        <input
                            type={type}
                            name={name}
                            style={{
                                padding: '0.5rem 0.75rem',
                                fontSize: '1rem',
                                border: '1.5px solid #ccc',
                                borderRadius: '4px',
                                fontFamily: 'Arial, sans-serif',
                                transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                                marginBottom: '1rem',
                                width: '100%',
                                boxSizing: 'border-box',
                                width: '70vw',
                                ...style,
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#007BFF';
                                e.target.style.boxShadow = '0 0 5px rgba(0, 123, 255, 0.5)';
                                e.target.style.outline = 'none';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = '#ccc';
                                e.target.style.boxShadow = 'none';
                            }}
                            defaultValue={todo?.[input.name] || ""}
                            {...inputProps}
                        />
                        <br />
                    </div>);
                })}
            </form>
        </div>

        {/* FOOTER */}
        <div style={{flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
            <button
                style={{height: '100%', width: '20%'}}
                onClick={() => setShow(null)}
            >CLOSE</button>
            <button
                style={{height: '100%', width: '20%'}}
                onClick={() => {
                    if (formRef.current) {
                        const formData = new FormData(formRef.current);
                        const data = Object.fromEntries(formData.entries());
                        setShow(null);
                        onSubmit(data)
                    }
                }}
            >SUBMIT</button>
        </div>
      </div>
    </div>
  );
};