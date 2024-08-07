
from django.shortcuts import render

from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.db import connection
from django.db.utils import DatabaseError, DataError, IntegrityError

import os
import json

from numpy import extract
import sqlparse
from sqlparse.sql import IdentifierList, Identifier, TokenList
from sqlparse.tokens import Keyword, DML, Whitespace, Name, Comment

import psycopg2.extensions as ext


# def extract_tables(sql):
#     # Parse the SQL query
#     parsed = sqlparse.parse(sql)
#     tables = set()
    
#     # Function to recursively search for tables
#     def parse(token_list):
#         for token in token_list:
#             if isinstance(token, TokenList):  # Check if token is a TokenList before recursing
#                 if isinstance(token, Identifier):
#                     value = token.get_real_name()
#                     if value:
#                         tables.add(value)
#                 parse(token.tokens)
#             elif isinstance(token, Identifier):
#                 value = token.get_real_name()
#                 if value and value not in tables:
#                     tables.add(value)
    
#     # Start parsing
#     parse(parsed[0].tokens)
#     return list(tables)

def extract_tables(sql):
    # Parse the SQL
    query = sql.strip().lower()
    parsed = sqlparse.parse(query)
    tables = set()

    for statement in parsed:
        # Iterate through tokens in the statement
        potential_table_name_next = False
        for token in statement.tokens:
            # print(f"{token.value=}, {potential_table_name_next=}")
            # We skip whitespace and other unnecessary tokens
            # print(f"{token.ttype=}")
            if token.ttype is Keyword and token.value in ["from", "into", "table"]:
                potential_table_name_next = True
            elif token.ttype is Keyword.DML and token.value in ["update"]:
                potential_table_name_next = True
            elif token.ttype is Whitespace or token.ttype is Comment:
                continue

            elif potential_table_name_next:
                tables.add(token.value)
                potential_table_name_next = False  # Reset the flag after capturing the table name

            else:
                is_table_name_next = False
    
    return list(tables)

def is_drop_table_statement(sql):
    # Parse the SQL statement
    parsed = sqlparse.parse(sql)[0]

    # Iterate through the tokens in the parsed statement
    found_drop = False
    found_table = False
    table = None
    for token in parsed.tokens:
        # Ignore whitespace
        if token.is_whitespace or token.ttype is Comment:
            continue
        elif found_table:
            return found_drop and found_table, token.value
        
        # Check if the current token is a DDL keyword
        if token.ttype is Keyword.DDL and token.value.upper() == 'DROP':
            found_drop = True
        # Check for the TABLE keyword following DROP
        if found_drop and token.ttype is Keyword and token.value.upper() == 'TABLE':
            found_table = True

    # Return True only if both DROP and TABLE are found consecutively
    return found_drop and found_table, table

def home(request):
    return render(request, 'demo.html')


@require_http_methods(["POST"])
def execute_query(request):
    query = request.POST.get('query')
    print(f"{query=}")

    try:
        with connection.cursor() as cursor:
            # special case: show all tables
            if query.strip().lower() == '\\dt':
                query = """
                SELECT table_name
                FROM information_schema.tables
                WHERE table_schema = 'public'
                AND table_name NOT LIKE 'auth_%'
                AND table_name NOT LIKE 'django_%'
                AND table_name NOT LIKE 'admin_%';
                """
            
            cursor.execute(query)
            # Check if the query returns results
            if cursor.description:
                # For SELECT queries
                rows = cursor.fetchall()

                print(f"{rows=}")
                # Format rows into a list of dicts assuming you know the column names
                columns = [col[0] for col in cursor.description]
                print(f"{columns=}")        
                result = [dict(zip(columns, row)) for row in rows]

                # get table number from the query
                tables = extract_tables(query)
                print(f"{tables=}")
                return JsonResponse({"table": tables, "column": columns, "data": result, "success": True, 'type': 1})
            else:
                # For queries that don't return results
                # Utility commands: create table, drop table, alter table 
                # INSERT INTO, UPDATE .. SET, DELETE
                is_drop, tables = is_drop_table_statement(query)
                if (is_drop):
                    return JsonResponse({"table": tables, 'type': 3, "message": "Query executed successfully", "success": True})
        
                else:
                    tables = extract_tables(query)
                    return JsonResponse({"table": tables, 'type': 2, "message": "Query executed successfully", "success": True})
                
    except DatabaseError as e:
        # Log the error for debugging
        print(f"Database error occurred: {str(e)}")
        # Return a generic error message
        return JsonResponse({"error": "An error occurred while executing the query.", "success": False}, status=400)


'''
get all databases in current pg server
'''
@require_http_methods(["GET"])
def list_databases(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT datname FROM pg_database WHERE datistemplate = false;")
            rows = cursor.fetchall()
            databases = [row[0] for row in rows]
            return JsonResponse({"databases": databases, "success": True})
    except DatabaseError as e:
        print(f"Database error occurred: {str(e)}")
        return JsonResponse({"error": "An error occurred while fetching the databases.", "success": False}, status=500)