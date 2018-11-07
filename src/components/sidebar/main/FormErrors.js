import React from 'react';

export const FormErrors = ({formErrors}) =>
    <div className='formErrors'>
        {Object.keys(formErrors).map((fieldName, i) => {
            if(formErrors[fieldName].length > 0){
                if(fieldName === 'requiredFields'){
                    let msg = ''
                    formErrors[fieldName].forEach(function (value, key) {

                        if(key === formErrors[fieldName].length-1 ){
                            msg+= value;
                        }else {
                            msg+= `${value}, `;
                        }
                    })

                    return (
                        <p className="ui negative message small" key={i}>{msg} value is missing.</p>
                    )
                }
                return (
                    <p className="ui negative message small" key={i}>{fieldName !== 'availability' ? fieldName : ''} {formErrors[fieldName]}</p>
                )
            } else {
                return '';
            }
        })}
    </div>