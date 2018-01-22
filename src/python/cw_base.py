#!/usr/bin/python3
# -*- mode: python; Encoding: utf-8; coding: utf-8 -*-

"""
----------------------------------------------------------------
clipweb Base
  Author: ayaya (ayatec)
  GitHub: https://github.com/ayatec/clipweb
----------------------------------------------------------------
"""

# ----------------------------------------------------------------
# Import
# ----------------------------------------------------------------

import sys
from db import flex_sqlite3

AUTO_GENERATE = None

# ----------------------------------------------------------------
# Class
# ----------------------------------------------------------------

class Base:
    # ----------------------------------------------------------------
    # Define

    def __init__(cls, name="clipweb base"):
        cls.NAME = name
        cls._define()
        cls.result = {}
        cls.DB_PATH = "db/clipweb.db"
        cls.DB = flex_sqlite3.FlexSQLite3(cls.DB_PATH)

    # ----------------------------------------------------------------
    # Function
    # ----------------------------------------------------------------

    def set_cgi(cls, cgi=None):
        cls.cgi = cgi

    # ----------------------------------------------------------------
    # Inner Function
    # ----------------------------------------------------------------

    def _define(cls):
        cls.ERROR = {
            "code_not_defined": {
                "{} error".format(cls.NAME): {
                    "code": 51,
                    "message": "Error code does not defined."
                }
            },
            "hash_not_defined": {
                "{} error".format(cls.NAME): {
                    "code": 101,
                    "message": "[hash] does not defined."
                }
            },
            "username_not_defined": {
                "{} error".format(cls.NAME): {
                    "code": 102,
                    "message": "[username] does not defined."
                }
            },
            "email_address_not_defined": {
                "{} error".format(cls.NAME): {
                    "code": 103,
                    "message": "[email_address] does not defined."
                }
            },
            "password_hash_not_defined": {
                "{} error".format(cls.NAME): {
                    "code": 104,
                    "message": "[password_hash] does not defined."
                }
            },
            "encrypted_crypto_hash_not_defined": {
                "{} error".format(cls.NAME): {
                    "code": 105,
                    "message": "[encrypted_crypto_hash] does not defined."
                }
            },
            "theme_not_defined": {
                "{} error".format(cls.NAME): {
                    "code": 106,
                    "message": "[theme] does not defined."
                }
            },
            "default_owner_publish_not_defined": {
                "{} error".format(cls.NAME): {
                    "code": 107,
                    "message": "[default_owner_publish] does not defined."
                }
            },
            "default_clip_mode_not_defined": {
                "{} error".format(cls.NAME): {
                    "code": 108,
                    "message": "[default_clip_mode] does not defined."
                }
            },
            "created_at_not_defined": {
                "{} error".format(cls.NAME): {
                    "code": 109,
                    "message": "[created_at] does not defined."
                }
            },
            "updated_at_not_defined": {
                "{} error".format(cls.NAME): {
                    "code": 110,
                    "message": "[updated_at] does not defined."
                }
            },
            "hash_unknown_class": {
                "{} error".format(cls.NAME): {
                    "code": 201,
                    "message": "[hash] is unknown class"
                }
            },
            "username_unknown_class": {
                "{} error".format(cls.NAME): {
                    "code": 202,
                    "message": "[username] is unknown class"
                }
            },
            "email_address_unknown_class": {
                "{} error".format(cls.NAME): {
                    "code": 203,
                    "message": "[email_address] is unknown class"
                }
            },
            "password_hash_unknown_class": {
                "{} error".format(cls.NAME): {
                    "code": 204,
                    "message": "[password_hash] is unknown class"
                }
            },
            "encrypted_crypto_hash_unknown_class": {
                "{} error".format(cls.NAME): {
                    "code": 205,
                    "message": "[encrypted_crypto_hash] is unknown class"
                }
            },
            "theme_unknown_class": {
                "{} error".format(cls.NAME): {
                    "code": 206,
                    "message": "[theme] is unknown class"
                }
            },
            "default_owner_publish_unknown_class": {
                "{} error".format(cls.NAME): {
                    "code": 207,
                    "message": "[default_owner_publish] is unknown class"
                }
            },
            "default_clip_mode_unknown_class": {
                "{} error".format(cls.NAME): {
                    "code": 208,
                    "message": "[default_clip_mode] is unknown class"
                }
            },
            "created_at_unknown_class": {
                "{} error".format(cls.NAME): {
                    "code": 209,
                    "message": "[created_at] is unknown class"
                }
            },
            "updated_at_unknown_class": {
                "{} error".format(cls.NAME): {
                    "code": 210,
                    "message": "[updated_at] is unknown class"
                }
            },
            "username_overlap": {
                "{} error".format(cls.NAME): {
                    "code": 301,
                    "message": "Username already exists."
                }
            },
            "email_address_overlap": {
                "{} error".format(cls.NAME): {
                    "code": 302,
                    "message": "User Email address already exists."
                }
            },
            "hash_overlap": {
                "{} error".format(cls.NAME): {
                    "code": 303,
                    "message": "User hash already exists."
                }
            },
            "email_password_incorrect": {
                "{} error".format(cls.NAME): {
                    "code": 401,
                    "message": "The combination of the e-mail address and the password is incorrect."
                }
            },
            "password_incorrect": {
                "{} error".format(cls.NAME): {
                    "code": 402,
                    "message": "Password is incorrect."
                }
            },
            "user_not_found": {
                "{} error".format(cls.NAME): {
                    "code": 403,
                    "message": "User data not found."
                }
            },
            "clip_not_exists": {
                "{} error".format(cls.NAME): {
                    "code": 404,
                    "message": "Your clip not exists."
                }
            },
            "corrupt_userdata": {
                "{} error".format(cls.NAME): {
                    "code": 801,
                    "message": "User data is corrupted. Please contact the administrator."
                }
            }
        }

    def _error(
        cls,
        code=None,
        *arguments,
        **keyword_arguments
    ):
        if code is None:
            return cls._error("code_not_defined", mode=sys._getframe().f_code.co_name)

        error = cls.ERROR[code]

        for i_args in range(len(arguments)):
            custom_message = "Custom Message {0}".format(i_args)
            error["{} error".format(cls.NAME)][custom_message] = arguments[i_args]

        for key in keyword_arguments.keys():
            error["{} error".format(cls.NAME)][key] = keyword_arguments[key]

        return error

    def _check_str(
        cls,
        model=None,
        type=str,
        not_defined_error=None,
        unknown_class_error=None
    ):
        if isinstance(model, type):
            if len(model) == 0:
                cls.result["error"] = cls._error(not_defined_error)
                return False
        elif model is None:
            cls.result["error"] = cls._error(not_defined_error)
            return False
        else:
            cls.result["error"] = cls._error(unknown_class_error)
            return False

        return True