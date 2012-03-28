// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// This file adds defines about the platform we're currently building on.
//  Operating System:
//    OS_WIN / OS_MACOSX / OS_LINUX / OS_POSIX (MACOSX or LINUX)
//  Compiler:
//    COMPILER_MSVC / COMPILER_GCC
//  Processor:
//    ARCH_CPU_X86 / ARCH_CPU_X86_64 / ARCH_CPU_X86_FAMILY (X86 or X86_64)
//    ARCH_CPU_32_BITS / ARCH_CPU_64_BITS

#ifndef BUILD_BUILD_CONFIG_H_
#define BUILD_BUILD_CONFIG_H_

#define OS_MACOSX 1

// A flag derived from the above flags, used to cover GTK code in
// both TOOLKIT_GTK and TOOLKIT_VIEWS.
#if defined(TOOLKIT_GTK) || (defined(TOOLKIT_VIEWS) && !defined(OS_WIN))
#define TOOLKIT_USES_GTK 1
#endif

#if defined(OS_LINUX) || defined(OS_FREEBSD) || defined(OS_OPENBSD) || defined(OS_NETBSD) || defined(OS_DRAGONFLY)
#define USE_NSS 1  // Use NSS for crypto.
#define USE_X11 1  // Use X for graphics.
#endif

// For access to standard POSIXish features, use OS_POSIX instead of a
// more specific macro.
#if defined(OS_MACOSX) || defined(OS_LINUX) || defined(OS_FREEBSD) || defined(OS_OPENBSD) || defined(OS_NETBSD) || defined(OS_SOLARIS) || defined(OS_DRAGONFLY)
#define OS_POSIX 1
// Use base::DataPack for name/value pairs.
#define USE_BASE_DATA_PACK 1
#endif

// Use tcmalloc
#if defined(OS_WIN) && ! defined(NO_TCMALLOC)
#define USE_TCMALLOC 1
#endif

// Compiler detection.
#if defined(__GNUC__)
#define COMPILER_GCC 1
#elif defined(_MSC_VER)
#define COMPILER_MSVC 1
#else
#error Please add support for your compiler in build/build_config.h
#endif

#define ARCH_CPU_X86_FAMILY 1
#define ARCH_CPU_X86 1
#define ARCH_CPU_32_BITS 1
#define WCHAR_T_IS_UTF16

#endif  // BUILD_BUILD_CONFIG_H_
