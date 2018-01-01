#!/usr/bin/python3
# -*- mode: python; Encoding: utf-8; coding: utf-8 -*-

"""
----------------------------------------------------------------
clipweb User
  Author: Aya Nakazawa
  GitHub: https://github.com/AyaNakazawa
----------------------------------------------------------------
"""

# ----------------------------------------------------------------
# Import
# ----------------------------------------------------------------

from web import cgi
from db import sqlite3

AUTO_GENERATE = None

# ----------------------------------------------------------------
# Class
# ----------------------------------------------------------------

class User:
    # ----------------------------------------------------------------
    # Define

    DB = sqlite3.SQLite3()

    # ----------------------------------------------------------------
    # Constructor
    # ----------------------------------------------------------------

    def __init__(cls):
        print("init clipweb User")

    # ----------------------------------------------------------------
    # Function
    # ----------------------------------------------------------------

    def register(cls):
        print("User.register()")

    def login(cls):
        print("User.login()")

    def setting(cls):
        print("User.setting()")

    def info(cls):
        print("User.info()")

    def leave(cls):
        print("User.leave()")
