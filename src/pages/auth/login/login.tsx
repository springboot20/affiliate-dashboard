import { EyeIcon, EyeSlashIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/app/hook';
import { login } from '@/features/thunks/auth.thunk';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import { loginSchema } from '@/schema/auth/login';
import { LoginState } from '@/types/formik/formik';
import { CustomErrorMessage } from '@/components/Error';
import { classNames } from '@/utils';
import { Loader } from '@/components/Loader';
import { toast } from 'react-toastify';

const initialValues: LoginState = {
  email: '',
  password: '',
};

export const Login = () => {
  const dispatch = useAppDispatch();
  const [show, setShow] = useState<boolean>(false);
  const navigate = useNavigate();

  async function onSubmit(values: LoginState, { resetForm }: FormikHelpers<LoginState>) {
    dispatch(login(values))
      .unwrap()
      .then(async (response) => {
        console.log(response);

        await Promise.resolve(
          setTimeout(() => {
            navigate('/app/overview');
            resetForm();
          })
        );
        return response;
      })
      .catch((error) => {
        toast.error(error);
      });
  }

  return (
    <>
      <div className='flex flex-col justify-center items-center min-h-screen p-3'>
        <div className='mx-auto max-w-md'>
          <UserCircleIcon className='mx-auto h-12 w-auto text-indigo-600' />
          <h2 className='mt-2 text-xl sm:text-2xl text-center font-semibold text-gray-700'>
            Sign in to your account
          </h2>
        </div>
        <Formik initialValues={initialValues} validationSchema={loginSchema} onSubmit={onSubmit}>
          {({ errors, touched, isValid, isSubmitting }) => {
            console.log(isSubmitting);
            return (
              <Form className='mt-10 w-full bg-white rounded-lg p-6 max-w-xl'>
                <fieldset>
                  <div className='flex items-center justify-between'>
                    <label
                      htmlFor='email'
                      className='text-sm font-medium text-gray-700 sm:text-base'>
                      Email Address
                    </label>
                    <ErrorMessage name='email'>
                      {(msg) => (
                        <CustomErrorMessage className='text-sm mt-0.5 block text-red-600'>
                          {msg}
                        </CustomErrorMessage>
                      )}
                    </ErrorMessage>
                  </div>
                  <div className='mt-2'>
                    <Field
                      id='email'
                      name='email'
                      type='email'
                      autoComplete='username'
                      placeholder='enter your email...'
                      className={classNames(
                        'block w-full px-3 rounded-md border-0 py-2.5 sm:py-4 md:py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 outline-none',
                        touched.email && errors.email
                          ? 'focus:ring-red-600 ring-red-600'
                          : 'focus:ring-indigo-600'
                      )}
                    />
                  </div>
                </fieldset>

                <>
                  <fieldset className='mt-2'>
                    <label
                      htmlFor='password'
                      className='text-sm font-medium text-gray-700 sm:text-base'>
                      Password
                    </label>

                    <div className='mt-2 relative'>
                      <Field
                        type={show ? 'text' : 'password'}
                        id='password'
                        name='password'
                        autoComplete='current-password'
                        placeholder='enter your password...'
                        className={classNames(
                          'block w-full px-3 rounded-md border-0 py-2.5 sm:py-4 md:py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 outline-none',
                          touched.password && errors.password
                            ? 'focus:ring-red-600 ring-red-600'
                            : 'focus:ring-indigo-600'
                        )}
                      />
                      <button
                        type='button'
                        className='absolute top-1/2 -translate-y-1/2 right-4'
                        onClick={() => setShow(!show)}>
                        {show ? (
                          <EyeSlashIcon className='h-6 w-6 cursor-pointer text-gray-800' />
                        ) : (
                          <EyeIcon className='h-6 w-6 cursor-pointer text-gray-800 ' />
                        )}
                      </button>
                    </div>
                  </fieldset>
                  <ErrorMessage name='password'>
                    {(msg) => (
                      <CustomErrorMessage className='text-sm mt-0.5 block text-red-600'>
                        {msg}
                      </CustomErrorMessage>
                    )}
                  </ErrorMessage>
                </>

                <div className='flex items-center justify-between mt-2'>
                  <div className='flex items-center space-x-1'>
                    <>
                      <label htmlFor='check' className='hidden sr-only'>
                        Check box
                      </label>
                      <input id='check' type='checkbox' className='rounded-sm' />
                    </>
                    <span className='text-sm font-medium text-gray-700'>Remember me</span>
                  </div>
                  <Link
                    to={'/auth/forgot-password'}
                    className='text-sm text-indigo-600 font-medium'>
                    forgot password?
                  </Link>
                </div>
                <button
                  type='submit'
                  disabled={!isValid}
                  className='disabled:bg-indigo-300 disabled:translate-y-0 disabled:cursor-not-allowed block py-2.5 w-full mt-5 bg-indigo-500 rounded-md transform hover:-translate-y-1.5 transition shadow-md'
                  style={{ textTransform: 'uppercase' }}>
                  {isSubmitting ? (
                    <Loader />
                  ) : (
                    <span className='text-white text-sm font-medium uppercase tracking-wider'>
                      sign in
                    </span>
                  )}
                </button>
              </Form>
            );
          }}
        </Formik>
        <div className='mx-auto mt-3'>
          <p className='text-center text-sm font-normal text-gray-800'>
            Don't have an account?{' '}
            <Link
              to='/auth/register'
              className='font-semibold leading-6 text-indigo-600 hover:text-indigo-500'>
              SignUp
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};
