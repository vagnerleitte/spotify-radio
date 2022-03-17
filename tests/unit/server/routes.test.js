import config from "../../../server/config.js"
import { jest, expect, describe, test, beforeEach } from "@jest/globals"
import { Controller } from "../../../server/controller.js";
import { handler } from "../../../server/routes.js"
import TestUtil from "../../unit/_util/testUtil"

const {
  pages,
  location,
  constants: { CONTENT_TYPE }
} = config;

describe('#Routes - test suite for api response', () => {

  beforeEach(() => {
    jest.restoreAllMocks()
    jest.clearAllMocks()
  })

  test(`GET / - should redirect to home page`, async () => {
    const params = TestUtil.defaultHandleParams()
    params.request.method = 'GET'
    params.request.url = '/'

    await handler(...params.values())
    expect(params.response.end).toHaveBeenCalled()
    expect(params.response.writeHead).toHaveBeenCalledWith(
      302,
      {
        'Location': location.home
      }
    )
  })
  test(`GET /home - should respond with ${pages.homeHTML} file stream`, async () => {
    const params = TestUtil.defaultHandleParams()
    params.request.method = 'GET'
    params.request.url = '/home'

    const mockFileStream = TestUtil.generateReadableString(['data'])

    jest.spyOn(
      Controller.prototype,
      Controller.prototype.getFileStream.name
    ).mockResolvedValue({
      stream: mockFileStream
    })

    jest.spyOn(
      mockFileStream,
      "pipe"
    ).mockReturnValue()

    await handler(...params.values())

    expect(Controller.prototype.getFileStream).toHaveBeenCalledWith(pages.homeHTML)
    expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response)
  })
  test(`GET /home - should respond with ${pages.controllerHTML} file stream`, async () => {
    const params = TestUtil.defaultHandleParams()
    params.request.method = 'GET'
    params.request.url = '/controller'

    const mockFileStream = TestUtil.generateReadableString(['data'])

    jest.spyOn(
      Controller.prototype,
      Controller.prototype.getFileStream.name
    ).mockResolvedValue({
      stream: mockFileStream
    })

    jest.spyOn(
      mockFileStream,
      "pipe"
    ).mockReturnValue()

    await handler(...params.values())

    expect(Controller.prototype.getFileStream).toHaveBeenCalledWith(pages.controllerHTML)
    expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response)
  })

  test(`GET /index.html - should respond with file stream`, async () => {
    const params = TestUtil.defaultHandleParams()
    const expectedType = '.html'
    const fileName = '/index.html'
    params.request.method = 'GET'
    params.request.url = fileName

    const mockFileStream = TestUtil.generateReadableString(['data'])

    jest.spyOn(
      Controller.prototype,
      Controller.prototype.getFileStream.name
    ).mockResolvedValue({
      stream: mockFileStream,
      type: expectedType
    })

    jest.spyOn(
      mockFileStream,
      "pipe"
    ).mockReturnValue()

    await handler(...params.values())

    expect(Controller.prototype.getFileStream).toBeCalledWith(fileName)
    expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response)
    expect(params.response.writeHead).toHaveBeenCalledWith(
      200, {
      'Content-Type': CONTENT_TYPE[expectedType]
    }
    )
  })

  test(`GET /file.ext - should respond with file stream`, async () => {
    const params = TestUtil.defaultHandleParams()
    const expectedType = '.ext'
    const fileName = '/file.ext'
    params.request.method = 'GET'
    params.request.url = fileName

    const mockFileStream = TestUtil.generateReadableString(['data'])

    jest.spyOn(
      Controller.prototype,
      Controller.prototype.getFileStream.name
    ).mockResolvedValue({
      stream: mockFileStream,
      type: expectedType
    })

    jest.spyOn(
      mockFileStream,
      "pipe"
    ).mockReturnValue()

    await handler(...params.values())

    expect(Controller.prototype.getFileStream).toBeCalledWith(fileName)
    expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response)
    expect(params.response.writeHead).not.toHaveBeenCalledWith()
  })


  test(`POST /unknown - given an inexistent rout it should respond with 404 error`, async () => {
    const params = TestUtil.defaultHandleParams()
    params.request.method = 'POST'
    params.request.url = '/unknown'

    await handler(...params.values())

    expect(params.response.writeHead).toHaveBeenCalledWith(404)
    expect(params.response.end).toHaveBeenCalled()
  })

  describe('exceptions', () => {
    test('given inexistent file it should respond with 404', async () => {
      const params = TestUtil.defaultHandleParams()
      params.request.method = 'GET'
      params.request.url = '/index.png'

      jest.spyOn(
        Controller.prototype,
        Controller.prototype.getFileStream.name
      ).mockRejectedValue(new Error('ENOENT: error file or directory not found'))

      await handler(...params.values())

      expect(params.response.writeHead).toHaveBeenCalledWith(404)
      expect(params.response.end).toHaveBeenCalled()
    })

    test('given an error it should respond with 500', async () => {
      const params = TestUtil.defaultHandleParams()
      params.request.method = 'GET'
      params.request.url = '/index.png'

      jest.spyOn(
        Controller.prototype,
        Controller.prototype.getFileStream.name
      ).mockRejectedValue(new Error('unknown error'))

      await handler(...params.values())

      expect(params.response.writeHead).toHaveBeenCalledWith(500)
      expect(params.response.end).toHaveBeenCalled()
    })
  })
})