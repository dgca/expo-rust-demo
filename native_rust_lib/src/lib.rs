#[no_mangle]
pub extern "C" fn rust_add(left: i32, right: i32) -> i32 {
    left + right
}

/// cbindgen:ignore
#[cfg(target_os = "android")]
pub mod android {
    use crate::rust_add;
    use jni::JNIEnv;
    use jni::objects::JClass;
    use jni::sys::jint;
    
    #[no_mangle]
    pub unsafe extern "C" fn Java_expo_modules_myrustmodule_MyRustModule_rustAdd(
        _env: JNIEnv,
        _class: JClass,
        a: jint,
        b: jint
    ) -> jint {
        rust_add(a, b)
    }
}